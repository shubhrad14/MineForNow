const Booking = require("../models/Booking");
const Item = require("../models/Item");

// ========================================================
// 1. CREATE BOOKING (INSTANT OR APPROVAL REQUIRED)
// POST /api/bookings
// ========================================================
const createBooking = async (req, res) => {
  try {
    const {
      itemId,
      startDate,
      endDate,
      quantity = 1,
      deliveryAddress,
      renterId,
      renterName,
      renterEmail,
      renterPhone,
    } = req.body;

    const actualRenterId = req.user ? req.user._id : renterId;

    if (!itemId || !startDate || !endDate || !actualRenterId) {
      return res.status(400).json({
        success: false,
        message: "Item, rental dates, and renter information are required.",
      });
    }

    // 1. Fetch item from database (never trust client prices!)
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Rental item not found." });
    }

    if (!item.isAvailable || item.availabilityStatus !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This gear is currently unavailable for rental.",
      });
    }

    // 2. Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // 3. Recalculate official financials
    const qty = Number(quantity) || 1;
    const pricePerDay = Number(item.price);
    const rentalFee = pricePerDay * rentalDays * qty;
    const securityDeposit = Number(item.securityDeposit || 0) * qty;
    const deliveryFee = 150; // Standard flat delivery fee
    const totalAmount = rentalFee + securityDeposit + deliveryFee;

    // 4. Determine Instant vs. Approval Required
    const isApprovalRequired = Boolean(item.requiresApproval);
    const bookingType = isApprovalRequired ? "ApprovalRequired" : "Instant";
    const bookingStatus = isApprovalRequired ? "PendingApproval" : "PaymentPending";

    // 15-minute hold timer for Instant, or null
    const paymentHoldExpiry = isApprovalRequired
      ? null
      : new Date(Date.now() + 15 * 60 * 1000);

    // 5. Create Booking
    const newBooking = await Booking.create({
      item: item._id,
      itemName: item.name,
      itemImage: item.image || (item.images && item.images[0]) || "",
      itemCategory: item.category,
      renter: actualRenterId,
      renterName: renterName || req.user?.name || "Renter",
      renterEmail: renterEmail || req.user?.email || "",
      renterPhone: renterPhone || req.user?.phone || "",
      owner: item.owner,
      startDate: start,
      endDate: end,
      rentalDays,
      quantity: qty,
      pricePerDay,
      rentalFee,
      securityDeposit,
      deliveryFee,
      totalAmount,
      deliveryAddress: deliveryAddress || {},
      bookingType,
      bookingStatus,
      paymentStatus: "Unpaid",
      paymentHoldExpiry,
    });

    return res.status(201).json({
      success: true,
      message: isApprovalRequired
        ? "Rental request submitted to owner for approval."
        : "Booking created! Please complete payment within 15 minutes.",
      booking: newBooking,
      isApprovalRequired,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating rental booking.",
      error: error.message,
    });
  }
};

// ========================================================
// 2. GET RENTER'S BOOKINGS ("MY RENTALS")
// GET /api/bookings/my-rentals?userId=...
// ========================================================
const getMyRentals = async (req, res) => {
  try {
    const renterId = req.user ? req.user._id : req.query.userId;
    if (!renterId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const bookings = await Booking.find({ renter: renterId })
      .populate("item", "name category image price location")
      .populate("owner", "name email phone profileImage")
      .sort({ createdAt: -1 });

    // Check expired 15-minute hold bookings
    const now = new Date();
    for (let b of bookings) {
      if (
        b.bookingStatus === "PaymentPending" &&
        b.paymentHoldExpiry &&
        b.paymentHoldExpiry < now
      ) {
        b.bookingStatus = "Cancelled";
        await b.save();
      }
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get My Rentals Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching rentals." });
  }
};

// ========================================================
// 3. GET OWNER'S RENTAL REQUESTS ("OWNER DASHBOARD")
// GET /api/bookings/owner-requests?ownerId=...
// ========================================================
const getOwnerRequests = async (req, res) => {
  try {
    const ownerId = req.user ? req.user._id : req.query.ownerId;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner ID is required." });
    }

    const requests = await Booking.find({ owner: ownerId })
      .populate("item", "name category image price location")
      .populate("renter", "name email phone profileImage isVerified")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Owner Requests Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching owner requests." });
  }
};

// ========================================================
// 4. UPDATE BOOKING STATUS (APPROVE / REJECT / COMPLETE)
// PUT /api/bookings/:id/status
// ========================================================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Approved", "Rejected", "Completed", "Cancelled"
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (status === "Approved") {
      booking.bookingStatus = "Approved";
      // Give renter a 24-hour window to complete payment
      booking.approvalDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (status === "Rejected") {
      booking.bookingStatus = "Rejected";
    } else if (status === "Completed") {
      booking.bookingStatus = "Completed";
    } else if (status === "Cancelled") {
      booking.bookingStatus = "Cancelled";
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking has been ${status.toLowerCase()}.`,
      booking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    return res.status(500).json({ success: false, message: "Error updating status." });
  }
};

// ========================================================
// 5. GET SINGLE BOOKING DETAILS
// GET /api/bookings/:id
// ========================================================
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("item")
      .populate("renter", "name email phone profileImage isVerified")
      .populate("owner", "name email phone profileImage isVerified");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyRentals,
  getOwnerRequests,
  updateBookingStatus,
  getBookingById,
};
