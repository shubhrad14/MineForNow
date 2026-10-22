const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyRentals,
  getOwnerRequests,
  updateBookingStatus,
  getBookingById,
} = require("../controllers/bookingController");

// Booking routes
router.post("/", createBooking);
router.get("/my-rentals", getMyRentals);
router.get("/owner-requests", getOwnerRequests);
router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);

module.exports = router;
