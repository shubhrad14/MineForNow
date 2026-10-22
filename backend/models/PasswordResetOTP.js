
const mongoose = require("mongoose");

const passwordResetOTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpiry: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PasswordResetOTP",
  passwordResetOTPSchema
);
