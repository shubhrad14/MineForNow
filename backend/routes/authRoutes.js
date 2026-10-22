const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deactivateAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register & Login
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// User Profile (Supports JWT protect OR user id fallback in controller)
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/deactivate", deactivateAccount);

module.exports = router;
