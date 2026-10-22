const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
        type: String,
        enum: ["Borrower", "Owner", "Admin"],
        default: "Borrower",
      },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);

module.exports = PendingRegistration;