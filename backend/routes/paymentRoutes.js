const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyPayment,
  refundDeposit,
} = require("../controllers/paymentController");

// Razorpay payment routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);
router.post("/refund-deposit", refundDeposit);

module.exports = router;
