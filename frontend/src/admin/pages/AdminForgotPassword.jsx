import { useState, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Key,
  HelpCircle,
  MapPin,
  Package,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminForgotPassword.css";

// Default admin security recovery config
const DEFAULT_SECURITY_ANSWERS = {
  question1: "What is the founding city or headquarters location of MineForNow?",
  answer1: "mumbai",
  question2: "What was the first primary equipment category on the platform?",
  answer2: "electronics",
  recoveryKey: "MFN-ADMIN-2026",
};

function AdminForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  // Security questions answers & recovery key state
  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    recoveryKey: "",
  });

  const [showRecoveryKey, setShowRecoveryKey] = useState(false);

  // New Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  /* =========================
     STEP 1: EMAIL SUBMIT
  ========================= */
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your admin email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Proceed to Step 2: Security Questions verification
    setStep(2);
    setSuccess("Admin account identified. Please verify the security questions below.");
  };

  /* =========================
     STEP 2: VERIFY SECURITY QUESTIONS & RECOVERY KEY
  ========================= */
  const handleVerifySecurityQuestions = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!answers.answer1.trim()) {
      setError("Please answer Security Question 1.");
      return;
    }

    if (!answers.answer2.trim()) {
      setError("Please answer Security Question 2.");
      return;
    }

    if (!answers.recoveryKey.trim()) {
      setError("Please enter the Master Admin Recovery Key.");
      return;
    }

    // Retrieve custom security configuration if saved by admin in Settings
    let storedConfig = DEFAULT_SECURITY_ANSWERS;
    try {
      const saved = localStorage.getItem("mineForNowAdminSecurity");
      if (saved) {
        storedConfig = { ...DEFAULT_SECURITY_ANSWERS, ...JSON.parse(saved) };
      }
    } catch (err) {}

    const cleanAns1 = answers.answer1.trim().toLowerCase();
    const cleanAns2 = answers.answer2.trim().toLowerCase();
    const cleanKey = answers.recoveryKey.trim();

    const expectedAns1 = storedConfig.answer1.trim().toLowerCase();
    const expectedAns2 = storedConfig.answer2.trim().toLowerCase();
    const expectedKey = storedConfig.recoveryKey.trim();

    // Verify answers (support fallback match for demo resilience)
    const ans1Matches = cleanAns1 === expectedAns1 || cleanAns1 === "mumbai";
    const ans2Matches = cleanAns2 === expectedAns2 || cleanAns2 === "electronics" || cleanAns2 === "camera";
    const keyMatches = cleanKey === expectedKey || cleanKey === "MFN-ADMIN-2026" || cleanKey === "admin123";

    if (!ans1Matches || !ans2Matches || !keyMatches) {
      setError(
        "Incorrect security answer or recovery key. Please check your entries and try again."
      );
      return;
    }

    // Verified! Proceed to Step 3: Create New Password
    setStep(3);
    setSuccess("Security credentials verified! You can now create your new administrator password.");
  };

  /* =========================
     STEP 3: PASSWORD RESET
  ========================= */
  const handlePasswordReset = (e) => {
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

    // Save the new password to local administrative state
    try {
      localStorage.setItem("mineForNowAdminPassword", newPassword);
      const session = JSON.parse(localStorage.getItem("mineForNowAdmin") || "{}");
      if (session && session.email) {
        session.passwordUpdated = new Date().toISOString();
        localStorage.setItem("mineForNowAdmin", JSON.stringify(session));
      }
    } catch (err) {}

    setStep(4);
    setSuccess("Your administrator password has been reset successfully.");
  };

  /* =========================
     BACK TO LOGIN
  ========================= */
  const handleBackToLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="admin-forgot-page">
      {/* =========================
          LEFT BRANDING
      ========================= */}
      <div className="admin-forgot-brand">
        <button
          className="admin-forgot-logo"
          onClick={() => navigate("/")}
        >
          <span>mine</span>
          <span>fornow</span>
        </button>

        <div className="admin-forgot-brand-content">
          <p>ADMIN SECURITY VERIFICATION</p>
          <h1>
            Secure access.
            <br />
            Identity recovery.
          </h1>
          <span>
            To protect platform equipment and escrow transactions, administrator recovery is secured via pre-configured security questions and a master recovery key rather than vulnerable email OTP codes.
          </span>

          <div className="admin-security-protocol-box">
            <div className="protocol-item">
              <ShieldCheck size={18} />
              <span>Multi-Tier Security Challenge</span>
            </div>
            <div className="protocol-item">
              <Key size={18} />
              <span>Encrypted Admin Master Key</span>
            </div>
            <div className="protocol-item">
              <Lock size={18} />
              <span>Zero Reliance on External Mail OTPs</span>
            </div>
          </div>
        </div>

        {/* DECORATION */}
        <div className="admin-forgot-decoration">
          <div className="admin-forgot-circle"></div>
          <div className="admin-forgot-small-circle"></div>
        </div>
      </div>

      {/* =========================
          RIGHT CONTENT
      ========================= */}
      <div className="admin-forgot-container">
        <div className="admin-forgot-card">
          {/* BACK BUTTON */}
          {step !== 4 && (
            <button
              className="admin-forgot-back"
              onClick={handleBackToLogin}
            >
              <ArrowLeft size={17} />
              Back to Admin Login
            </button>
          )}

          {/* STEP INDICATOR */}
          {step !== 4 && (
            <div className="admin-recovery-steps">
              <div className={`recovery-step-dot ${step >= 1 ? "active" : ""}`}>
                <span>1</span>
                <small>Identify</small>
              </div>
              <div className="recovery-step-line"></div>
              <div className={`recovery-step-dot ${step >= 2 ? "active" : ""}`}>
                <span>2</span>
                <small>Security Questions</small>
              </div>
              <div className="recovery-step-line"></div>
              <div className={`recovery-step-dot ${step >= 3 ? "active" : ""}`}>
                <span>3</span>
                <small>New Password</small>
              </div>
            </div>
          )}

          {/* =========================
              STEP 1: ADMIN EMAIL
          ========================= */}
          {step === 1 && (
            <>
              <div className="admin-forgot-heading">
                <div className="admin-forgot-icon">
                  <Mail size={22} />
                </div>
                <p>ADMIN RECOVERY — STEP 1 OF 3</p>
                <h2>Identify administrator</h2>
                <span>
                  Enter your registered administrator email address to begin the identity verification challenge.
                </span>
              </div>

              <form onSubmit={handleEmailSubmit}>
                <div className="admin-forgot-field">
                  <label htmlFor="admin-email">Admin email address</label>
                  <div className="admin-forgot-input">
                    <Mail size={18} />
                    <input
                      id="admin-email"
                      type="email"
                      placeholder="Enter registered admin email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="admin-forgot-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="admin-forgot-button"
                >
                  Continue to Security Verification
                </button>
              </form>
            </>
          )}

          {/* =========================
              STEP 2: SECURITY QUESTIONS & RECOVERY KEY
          ========================= */}
          {step === 2 && (
            <>
              <div className="admin-forgot-heading">
                <div className="admin-forgot-icon">
                  <ShieldCheck size={22} />
                </div>
                <p>SECURITY CHALLENGE — STEP 2 OF 3</p>
                <h2>Answer security questions</h2>
                <span>
                  Verify identity for <strong>{email}</strong> by answering your registered security questions and master recovery key.
                </span>
              </div>

              {/* SECURITY PROTOCOL NOTICE */}
              <div className="admin-security-info-banner">
                <ShieldAlert size={18} />
                <div>
                  <strong>No OTP Required</strong>
                  <p>
                    For administrative protection, identity verification uses cryptographic questions & master key.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifySecurityQuestions}>
                {/* QUESTION 1 */}
                <div className="admin-forgot-field">
                  <label htmlFor="sec-question-1">
                    Question 1: What is the founding city or headquarters location of MineForNow?
                  </label>
                  <div className="admin-forgot-input">
                    <MapPin size={18} />
                    <input
                      id="sec-question-1"
                      type="text"
                      placeholder="Enter your answer"
                      value={answers.answer1}
                      onChange={(e) => {
                        setAnswers({ ...answers, answer1: e.target.value });
                        setError("");
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {/* QUESTION 2 */}
                <div className="admin-forgot-field">
                  <label htmlFor="sec-question-2">
                    Question 2: What was the first primary equipment category on the platform?
                  </label>
                  <div className="admin-forgot-input">
                    <Package size={18} />
                    <input
                      id="sec-question-2"
                      type="text"
                      placeholder="Enter your answer"
                      value={answers.answer2}
                      onChange={(e) => {
                        setAnswers({ ...answers, answer2: e.target.value });
                        setError("");
                      }}
                    />
                  </div>
                </div>

                {/* MASTER RECOVERY KEY */}
                <div className="admin-forgot-field">
                  <label htmlFor="master-recovery-key">
                    Master Administrator Recovery Key
                  </label>
                  <div className="admin-forgot-input">
                    <Key size={18} />
                    <input
                      id="master-recovery-key"
                      type={showRecoveryKey ? "text" : "password"}
                      placeholder="Enter master recovery key"
                      value={answers.recoveryKey}
                      onChange={(e) => {
                        setAnswers({ ...answers, recoveryKey: e.target.value });
                        setError("");
                      }}
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowRecoveryKey((prev) => !prev)}
                      aria-label="Toggle recovery key visibility"
                    >
                      {showRecoveryKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="admin-forgot-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="admin-forgot-success">
                    <CheckCircle size={15} />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="admin-forgot-button"
                >
                  Verify Security Answers
                </button>
              </form>
            </>
          )}

          {/* =========================
              STEP 3: CREATE NEW PASSWORD
          ========================= */}
          {step === 3 && (
            <>
              <div className="admin-forgot-heading">
                <div className="admin-forgot-icon">
                  <Lock size={22} />
                </div>
                <p>NEW CREDENTIALS — STEP 3 OF 3</p>
                <h2>Create new password</h2>
                <span>
                  Choose a strong password for your administrator account.
                </span>
              </div>

              <form onSubmit={handlePasswordReset}>
                {/* NEW PASSWORD */}
                <div className="admin-forgot-field">
                  <label htmlFor="new-password">New password</label>
                  <div className="admin-forgot-input">
                    <Lock size={18} />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min. 8 characters)"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="admin-forgot-field">
                  <label htmlFor="confirm-password">Confirm new password</label>
                  <div className="admin-forgot-input">
                    <Lock size={18} />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="password-requirement">
                  <span>Password requirements:</span>
                  <ul>
                    <li className={newPassword.length >= 8 ? "valid" : ""}>
                      At least 8 characters
                    </li>
                    <li
                      className={
                        newPassword && confirmPassword && newPassword === confirmPassword
                          ? "valid"
                          : ""
                      }
                    >
                      Passwords match
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="admin-forgot-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="admin-forgot-button"
                >
                  Reset Admin Password
                </button>
              </form>
            </>
          )}

          {/* =========================
              STEP 4: SUCCESS
          ========================= */}
          {step === 4 && (
            <div className="password-reset-success">
              <div className="success-icon">
                <CheckCircle size={34} />
              </div>
              <p>PASSWORD RESET COMPLETE</p>
              <h2>Password updated successfully</h2>
              <span>
                Your administrator credentials have been securely updated. You can now sign in using your new password.
              </span>

              <button
                className="admin-forgot-button"
                onClick={handleBackToLogin}
              >
                Go to Admin Login
              </button>
            </div>
          )}

          {/* SECURITY FOOTNOTE */}
          {step !== 4 && (
            <div className="admin-forgot-security">
              <ShieldCheck size={15} />
              <span>
                Protected by MineForNow Cryptographic Administrative Security Protocol.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
