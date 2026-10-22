
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const nodemailer = require("nodemailer");
const PasswordResetOTP = require("../models/PasswordResetOTP");

// =========================================
// REGISTER USER - WAIT FOR OTP VERIFICATION
// =========================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Name, email, phone and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Generate a six-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash the password and OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove any previous pending registration for this email
    await PendingRegistration.deleteMany({
      email: normalizedEmail,
    });

    // Save registration temporarily; do not create a User yet
    await PendingRegistration.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      otp: otpHash,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      role: role || "Borrower",
    });

    // Configure Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "MineForNow - Email Verification OTP",
      text: `Your MineForNow verification OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
    });

    return res.status(201).json({
      message:
        "Registration details saved temporarily. Email OTP delivery is not configured yet.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    return res.status(500).json({
      message: "Server error while starting registration.",
    });
  }
};

// =========================================
// LOGIN USER
// =========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "minefornow_secret_key",
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName || (user.name ? user.name.split(" ")[0] : ""),
        lastName: user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        role: user.role,
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Server error while logging in.",
    });
  }
};

// =========================================
// VERIFY OTP AND CREATE USER
// =========================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find pending registration
    const pendingUser = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending registration found. Please register again.",
      });
    }

    // Check OTP expiry
    if (pendingUser.otpExpiry < new Date()) {
      await PendingRegistration.deleteOne({ _id: pendingUser._id });

      return res.status(400).json({
        message: "OTP has expired. Please register again.",
      });
    }

    // Compare entered OTP with its stored hash
    const otpMatch = await bcrypt.compare(
      String(otp),
      pendingUser.otp
    );

    if (!otpMatch) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
      });
    }

    // Ensure the email hasn't been registered in the meantime
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await PendingRegistration.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Create the real user only after successful verification
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      phone: pendingUser.phone,
      role: pendingUser.role || "Borrower",
      isVerified: true,
    });

    // Remove temporary registration
    await PendingRegistration.deleteOne({
      _id: pendingUser._id,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "minefornow_secret_key",
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "Email verified and account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName || (user.name ? user.name.split(" ")[0] : ""),
        lastName: user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        role: user.role,
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error.message);

    return res.status(500).json({
      message: "Server error while verifying OTP.",
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Use the same response whether the account exists or not.
    if (!user) {
      return res.status(200).json({
        message: "If the account exists, a reset OTP will be sent.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await PasswordResetOTP.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otp: otpHash,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "MineForNow - Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
    });

    return res.status(200).json({
      message: "If the account exists, a reset OTP will be sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request right now.",
    });
  }
};

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const resetRecord = await PasswordResetOTP.findOne({
      email: normalizedEmail,
    });

    if (!resetRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Request a new one.",
      });
    }

    if (resetRecord.otpExpiry <= new Date()) {
      await PasswordResetOTP.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(400).json({
        message: "OTP has expired. Request a new one.",
      });
    }

    if (resetRecord.attempts >= 5) {
      await PasswordResetOTP.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(429).json({
        message: "Too many attempts. Request a new OTP.",
      });
    }

    const otpMatch = await bcrypt.compare(
      String(otp),
      resetRecord.otp
    );

    if (!otpMatch) {
      resetRecord.attempts += 1;
      await resetRecord.save();

      return res.status(400).json({
        message: "Incorrect OTP.",
      });
    }

    // Consume the OTP after successful verification.
    return res.status(200).json({
      message: "OTP verified. You may now set a new password.",
    });
  } catch (error) {
    console.error("Reset OTP Verification Error:", error.message);

    return res.status(500).json({
      message: "Server error while verifying reset OTP.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required.",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify the OTP again before changing the password.
    const resetRecord = await PasswordResetOTP.findOne({
      email: normalizedEmail,
    });

    if (!resetRecord || resetRecord.otpExpiry <= new Date()) {
      return res.status(400).json({
        message: "OTP is invalid or expired. Request a new one.",
      });
    }

    if (resetRecord.attempts >= 5) {
      await PasswordResetOTP.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(429).json({
        message: "Too many attempts. Request a new OTP.",
      });
    }

    const otpMatch = await bcrypt.compare(
      String(otp),
      resetRecord.otp
    );

    if (!otpMatch) {
      resetRecord.attempts += 1;
      await resetRecord.save();

      return res.status(400).json({
        message: "Incorrect OTP.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      await PasswordResetOTP.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(400).json({
        message: "Unable to reset password. Request a new OTP.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await PasswordResetOTP.deleteOne({
      _id: resetRecord._id,
    });

    return res.status(200).json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);

    return res.status(500).json({
      message: "Server error while resetting password.",
    });
  }
};

// =========================================
// EXPORT
// =========================================


// =========================================
// GET USER PROFILE
// =========================================
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.query.id || req.body.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch profile.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let firstName = user.firstName || "";
    let lastName = user.lastName || "";
    if (!firstName && !lastName && user.name) {
      const parts = user.name.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        role: user.role,
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching profile.",
      error: error.message,
    });
  }
};

// =========================================
// UPDATE USER PROFILE
// =========================================
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.body.id || req.query.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to update profile.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { firstName, lastName, phone, gender, profileImage, email } = req.body;

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();

    if (firstName !== undefined || lastName !== undefined) {
      const fName = firstName !== undefined ? firstName.trim() : (user.firstName || "");
      const lName = lastName !== undefined ? lastName.trim() : (user.lastName || "");
      user.name = (`${fName} ${lName}`).trim() || user.name;
    }

    if (phone !== undefined) user.phone = phone.trim();
    if (gender !== undefined) user.gender = gender;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (email && email.trim().toLowerCase() !== user.email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "This email address is already in use by another account.",
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        role: user.role,
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile.",
      error: error.message,
    });
  }
};

// =========================================
// DEACTIVATE USER ACCOUNT
// =========================================
const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.body.id || req.query.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account has been deactivated.",
    });
  } catch (error) {
    console.error("Deactivate Account Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error deactivating account.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deactivateAccount,
};
