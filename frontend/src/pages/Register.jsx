import { useState, useRef } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
 
  const emailFieldRef = useRef(null);
  const phoneFieldRef = useRef(null);
  const passwordFieldRef = useRef(null);
  const confirmPasswordFieldRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // Password conditions
  const passwordConditions = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const passwordValid =
    passwordConditions.length &&
    passwordConditions.uppercase &&
    passwordConditions.lowercase &&
    passwordConditions.number &&
    passwordConditions.special;

  const passwordsMatch =
    formData.confirmPassword !== "" &&
    formData.password === formData.confirmPassword;

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
  
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
  
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
  
    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }
  
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      setError("");
  
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: "Borrower",
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }
  
      console.log("Registration successful:", data);
  
      // Save registered user temporarily for OTP step
      localStorage.setItem(
        "mineForNowPendingUser",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
      );
  
      navigate("/otp");
  
    } catch (error) {
      console.error("Registration error:", error);
  
      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // Password requirement component
  const PasswordRequirement = ({ valid, children }) => {
    return (
      <div className={`password-requirement ${valid ? "valid" : ""}`}>
        {valid ? (
          <Check size={14} />
        ) : (
          <X size={14} />
        )}

        <span>{children}</span>
      </div>
    );
  };

  return (
    <div className="register-page">

      {/* =========================
          LEFT BRANDING
      ========================= */}

      <div className="register-brand">

        <button
          className="register-logo"
          onClick={() => navigate("/")}
        >
          <span>mine</span>
          <span>fornow</span>
        </button>

        <div className="register-brand-content">
          <p>JOIN THE COMMUNITY</p>

          <h1>
            Share more.
            <br />
            Own less.
          </h1>

          <span>
            Create your MineForNow account and start
            renting the things you need, when you need them.
          </span>
        </div>

        <div className="brand-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-small"></div>
        </div>

      </div>


      {/* =========================
          REGISTER FORM
      ========================= */}

      <div className="register-container">

        <div className="register-card">

          <div className="register-heading">

            <p>CREATE ACCOUNT</p>

            <h2>Welcome to MineForNow</h2>

            <span>
              Create your account to get started.
            </span>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    emailFieldRef.current.focus();
                  }
                }}
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                ref={emailFieldRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    phoneFieldRef.current.focus();
                  }
                }}
              />

            </div>


            {/* Phone */}
            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="phone-input">

                <span>+91</span>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  ref={phoneFieldRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      passwordFieldRef.current.focus();
                    }
                  }}
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  ref={passwordFieldRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      confirmPasswordFieldRef.current.focus();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="password-toggle"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>


              {/* Password Conditions */}
              <div className="password-conditions">

                <span className="conditions-title">
                  Password must contain:
                </span>

                <PasswordRequirement
                  valid={passwordConditions.length}
                >
                  At least 8 characters
                </PasswordRequirement>

                <PasswordRequirement
                  valid={passwordConditions.uppercase}
                >
                  One uppercase letter
                </PasswordRequirement>

                <PasswordRequirement
                  valid={passwordConditions.lowercase}
                >
                  One lowercase letter
                </PasswordRequirement>

                <PasswordRequirement
                  valid={passwordConditions.number}
                >
                  One number
                </PasswordRequirement>

                <PasswordRequirement
                  valid={passwordConditions.special}
                >
                  One special character (! @ # $ % ^ & *)
                </PasswordRequirement>

              </div>

            </div>


            {/* Confirm Password */}
            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="password-input">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  ref={confirmPasswordFieldRef}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {formData.confirmPassword && (
                <div
                  className={`password-match ${
                    passwordsMatch ? "match" : "no-match"
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <Check size={14} />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <X size={14} />
                      Passwords do not match
                    </>
                  )}
                </div>
              )}

            </div>


            {/* Error */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>


          {/* Login */}
          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <button
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;