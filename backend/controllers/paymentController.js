const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Item = require("../models/Item");

// Lazy initialization of Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "rzp_test_your_key_id") {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// ========================================================
// 1. CREATE RAZORPAY ORDER
// POST /api/payments/create-order
// ========================================================
const createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    let booking = null;
    if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId).populate("item");
    }

    if (booking && booking.paymentStatus === "Paid") {
      return res.status(400).json({ success: false, message: "This booking is already paid." });
    }

    // Amount in Paise (e.g. ₹351 = 35100 Paise)
    const totalRupees = booking ? booking.totalAmount : Number(amount || 351);
    const amountInPaise = Math.round(totalRupees * 100);

    const rzp = getRazorpayInstance();

    // If Razorpay keys are not yet configured in .env, return a simulated order for local dev
    if (!rzp) {
      const mockOrderId = `order_mock_${Date.now()}`;
      if (booking) {
        booking.razorpayOrderId = mockOrderId;
        await booking.save();
      }

      return res.status(200).json({
        success: true,
        isMock: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: "INR",
        keyId: "rzp_test_mock_mode",
        booking,
        message: "Razorpay keys not set in .env. Running in simulated test mode.",
      });
    }

    // Real Razorpay API call
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: booking ? `bkg_${booking._id.toString().slice(-8)}` : `cart_${Date.now().toString().slice(-8)}`,
      notes: {
        bookingId: booking ? booking._id.toString() : "cart_checkout",
        itemName: booking ? booking.itemName : "MineForNow Rental Order",
      },
    };

    const order = await rzp.orders.create(options);

    if (booking) {
      booking.razorpayOrderId = order.id;
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      booking,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error initiating payment gateway.",
      error: error.message,
    });
  }
};

// ========================================================
// 2. VERIFY PAYMENT SIGNATURE
// POST /api/payments/verify
// ========================================================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      isMock,
    } = req.body;

    let booking = null;
    if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId);
    }

    // If running in local simulated mode
    if (isMock || process.env.RAZORPAY_KEY_ID === "rzp_test_your_key_id" || !process.env.RAZORPAY_KEY_SECRET) {
      if (booking) {
        booking.paymentStatus = "Paid";
        booking.bookingStatus = "Confirmed";
        booking.razorpayPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
        booking.razorpaySignature = "verified_mock_signature";
        await booking.save();
        if (booking.item) {
          await Item.findByIdAndUpdate(booking.item, {
            isAvailable: false,
            availabilityStatus: "Rented",
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment successfully verified (Simulated Mode). Rental confirmed!",
        booking,
      });
    }

    // Cryptographic HMAC SHA256 Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid digital signature.",
      });
    }

    // Legitimate Payment Verified!
    if (booking) {
      booking.paymentStatus = "Paid";
      booking.bookingStatus = "Confirmed";
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.razorpaySignature = razorpay_signature;
      await booking.save();
      if (booking.item) {
        await Item.findByIdAndUpdate(booking.item, {
          isAvailable: false,
          availabilityStatus: "Rented",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully! Your gear booking is confirmed.",
      booking,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment.",
      error: error.message,
    });
  }
};

// ========================================================
// 3. REFUND SECURITY DEPOSIT (POST-RETURN)
// POST /api/payments/refund-deposit
// ========================================================
const refundDeposit = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.depositRefundStatus === "Refunded") {
      return res.status(400).json({ success: false, message: "Security deposit has already been refunded." });
    }

    if (booking.securityDeposit <= 0) {
      return res.status(400).json({ success: false, message: "No security deposit was held for this rental." });
    }

    const rzp = getRazorpayInstance();
    const refundAmountInPaise = Math.round(booking.securityDeposit * 100);

    if (!rzp || !booking.razorpayPaymentId || booking.razorpayPaymentId.startsWith("pay_mock_")) {
      // Simulated refund
      booking.depositRefundStatus = "Refunded";
      booking.bookingStatus = "Completed";
      booking.razorpayRefundId = `rfnd_mock_${Date.now()}`;
      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Security deposit refunded successfully (Simulated Mode).",
        booking,
      });
    }

    // Real Razorpay Refund API
    const refund = await rzp.payments.refund(booking.razorpayPaymentId, {
      amount: refundAmountInPaise,
      notes: {
        reason: "Security deposit returned after gear inspection",
        bookingId: booking._id.toString(),
      },
    });

    booking.depositRefundStatus = "Refunded";
    booking.bookingStatus = "Completed";
    booking.razorpayRefundId = refund.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Security deposit refunded to renter's source account.",
      refund,
      booking,
    });
  } catch (error) {
    console.error("Refund Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error initiating refund.",
      error: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  refundDeposit,
};
