// USER LOGIN FORGOTPASSWORD

import { useState, useRef } from "react";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const otpRefs = useRef([]);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  /* =========================
     EMAIL
  ========================= */
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      setStep(2);
      setSuccess(
        data.message || "If the account exists, a reset OTP will be sent."
      );
    } catch (err) {
      console.error("Forgot Password Request Error:", err);
      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    }
  };


  /* =========================
     OTP
  ========================= */

  const handleOtpChange = (index, value) => {

    if (!/^\d?$/.test(value)) {
      return;
    }

    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);

    setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };


  const handleOtpKeyDown = (index, e) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };


  const handleOtpPaste = (e) => {

    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const updatedOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedValue
      .split("")
      .forEach((number, index) => {
        updatedOtp[index] = number;
      });

    setOtp(updatedOtp);

    const nextIndex = Math.min(
      pastedValue.length,
      5
    );

    otpRefs.current[nextIndex]?.focus();
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
  
    setError("");
    setSuccess("");
  
    const enteredOtp = otp.join("");
  
    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: enteredOtp,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Incorrect OTP. Please try again.");
        return;
      }
  
      setStep(3);
      setSuccess("OTP verified successfully. Create your new password.");
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  /* =========================
     PASSWORD
  ========================= */

  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    setError("");
    setSuccess("");
  
    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }
  
    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
  
    if (!confirmPassword.trim()) {
      setError("Please confirm your new password.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.join(""),
            newPassword,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }
  
      setStep(4);
      setSuccess("Your password has been reset successfully.");
    } catch (err) {
      console.error("Password Reset Error:", err);
      setError("Unable to connect to the server. Please try again.");
    }
  };


  /* =========================
     RESEND OTP
  ========================= */

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Unable to resend OTP.");
        return;
      }
  
      setOtp(["", "", "", "", "", ""]);
      setSuccess("If your account exists, a new OTP has been sent to your email.");
  
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  /* =========================
     BACK TO LOGIN
  ========================= */

  const handleBackToLogin = () => {
    navigate("/login");
  };


  return (

    <div className="forgot-page">

      {/* =========================
          LEFT BRANDING
      ========================= */}

      <div className="forgot-brand">

        <button
          className="forgot-logo"
          onClick={() => navigate("/")}
        >
          <span>mine</span>
          <span>fornow</span>
        </button>


        <div className="forgot-brand-content">

          <p>ACCOUNT RECOVERY</p>

          <h1>
            Secure access.
            <br />
            Simple recovery.
          </h1>

          <span>
            Reset your MineForNow password securely
            using email verification.
          </span>

        </div>


        {/* DECORATION */}

        <div className="forgot-decoration">

          <div className="forgot-circle"></div>

          <div className="forgot-small-circle"></div>

        </div>

      </div>


      {/* =========================
          RIGHT CONTENT
      ========================= */}

      <div className="forgot-container">

        <div className="forgot-card">


          {/* =========================
              BACK BUTTON
          ========================= */}

          {step !== 4 && (

            <button
              className="forgot-back"
              onClick={handleBackToLogin}
            >
              <ArrowLeft size={17} />
              Back to Login
            </button>

          )}


          {/* =========================
              STEP 1
          ========================= */}

          {step === 1 && (

            <>

              <div className="forgot-heading">

                <div className="forgot-icon">
                  <Mail size={22} />
                </div>

                <p>FORGOT PASSWORD</p>

                <h2>Reset your password</h2>

                <span>
                  Enter your registered email address
                  and we'll send you a verification code.
                </span>

              </div>


              <form onSubmit={handleEmailSubmit}>

                <div className="forgot-field">

                  <label htmlFor="user-email">
                    Email address
                  </label>

                  <div className="forgot-input">

                    <Mail size={18} />

                    <input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                    />

                  </div>

                </div>


                {error && (
                  <div className="forgot-error">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  className="forgot-button"
                >
                  Send Verification Code
                </button>

              </form>

            </>

          )}


          {/* =========================
              STEP 2
          ========================= */}

          {step === 2 && (

            <>

              <div className="forgot-heading">

                <div className="forgot-icon">
                  <ShieldCheck size={22} />
                </div>

                <p>EMAIL VERIFICATION</p>

                <h2>Enter verification code</h2>

                <span>
                  Enter the 6-digit code sent to
                  <strong> {email}</strong>
                </span>

              </div>


              <form onSubmit={handleVerifyOtp}>

                <div className="otp-fields">

                  {otp.map((value, index) => (

                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(index, e)
                      }
                      onPaste={
                        index === 0
                          ? handleOtpPaste
                          : undefined
                      }
                      aria-label={`OTP digit ${index + 1}`}
                    />

                  ))}

                </div>


                {error && (
                  <div className="forgot-error">
                    {error}
                  </div>
                )}


                {success && (
                  <div className="forgot-success">
                    <CheckCircle size={15} />
                    <span>{success}</span>
                  </div>
                )}


                <button
                  type="submit"
                  className="forgot-button"
                >
                  Verify OTP
                </button>


                <div className="resend-otp">

                  <span>
                    Didn't receive the code?
                  </span>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>

                </div>

              </form>

            </>

          )}


          {/* =========================
              STEP 3
          ========================= */}

          {step === 3 && (

            <>

              <div className="forgot-heading">

                <div className="forgot-icon">
                  <Lock size={22} />
                </div>

                <p>NEW PASSWORD</p>

                <h2>Create new password</h2>

                <span>
                  Choose a strong password for your
                  MineForNow account.
                </span>

              </div>


              <form onSubmit={handlePasswordReset}>


                {/* NEW PASSWORD */}

                <div className="forgot-field">

                  <label htmlFor="new-password">
                    New password
                  </label>

                  <div className="forgot-input">

                    <Lock size={18} />

                    <input
                      id="new-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(
                          e.target.value
                        );
                        setError("");
                      }}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="forgot-field">

                  <label htmlFor="confirm-password">
                    Confirm new password
                  </label>

                  <div className="forgot-input">

                    <Lock size={18} />

                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(
                          e.target.value
                        );
                        setError("");
                      }}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                <div className="password-requirement">

                  <span>Password must contain:</span>

                  <ul>

                    <li
                      className={
                        newPassword.length >= 8
                          ? "valid"
                          : ""
                      }
                    >
                      At least 8 characters
                    </li>

                  </ul>

                </div>


                {error && (
                  <div className="forgot-error">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  className="forgot-button"
                >
                  Reset Password
                </button>

              </form>

            </>

          )}


          {/* =========================
              STEP 4
          ========================= */}

          {step === 4 && (

            <div className="password-reset-success">

              <div className="success-icon">

                <CheckCircle size={34} />

              </div>

              <p>PASSWORD RESET</p>

              <h2>Password reset successfully</h2>

              <span>
                Your password has been updated.
                You can now log in using your
                new password.
              </span>


              <button
                className="forgot-button"
                onClick={handleBackToLogin}
              >
                Go to Login
              </button>

            </div>

          )}


          {/* =========================
              SECURITY NOTE
          ========================= */}

          {step !== 4 && (

            <div className="forgot-security">

              <ShieldCheck size={15} />

              <span>
                Your account security is important to us.
              </span>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default ForgotPassword;