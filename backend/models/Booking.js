const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemImage: {
      type: String,
      default: "",
    },
    itemCategory: {
      type: String,
      default: "",
    },

    // Renter / Borrower
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    renterName: {
      type: String,
      default: "",
    },
    renterEmail: {
      type: String,
      default: "",
    },
    renterPhone: {
      type: String,
      default: "",
    },

    // Owner / Lender
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Rental Period
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Financials in INR
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    rentalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Delivery address snapshot
    deliveryAddress: {
      name: String,
      phone: String,
      street: String,
      locality: String,
      city: String,
      state: String,
      pincode: String,
    },

    // State Machine
    bookingType: {
      type: String,
      enum: ["Instant", "ApprovalRequired"],
      default: "Instant",
    },
    bookingStatus: {
      type: String,
      enum: [
        "PaymentPending",  // Instant booking: held ~15 mins waiting for payment
        "PendingApproval", // Owner needs to approve first
        "Approved",        // Owner approved: 24h payment window
        "Confirmed",       // Paid & locked
        "Active",          // Item handed over to renter
        "Completed",       // Returned in good condition & deposit refunded
        "Rejected",        // Declined by owner
        "Cancelled",       // Cancelled by user or expired
      ],
      default: "PaymentPending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded", "PartiallyRefunded"],
      default: "Unpaid",
    },

    // Razorpay Audit
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },

    // Security Deposit Refund Lifecycle
    depositRefundStatus: {
      type: String,
      enum: ["Held", "RefundInitiated", "Refunded", "ClaimedForDamages"],
      default: "Held",
    },
    razorpayRefundId: {
      type: String,
      default: "",
    },

    // Timers
    paymentHoldExpiry: {
      type: Date,
    },
    approvalDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for fast queries by renter or owner
bookingSchema.index({ renter: 1, bookingStatus: 1 });
bookingSchema.index({ owner: 1, bookingStatus: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
