import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OTP.css";

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pendingUser = JSON.parse(
    localStorage.getItem("mineForNowPendingUser") || "null"
  );

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!pendingUser?.email) {
      setMessage("Registration details not found. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: pendingUser.email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed.");
        return;
      }

      localStorage.removeItem("mineForNowPendingUser");
      setMessage("Email verified successfully!");

      navigate("/login", {
        state: { message: "Registration successful. Please log in." },
      });
    } catch (error) {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <h2>Verify Your Email</h2>

        <p>
          Enter the 6-digit OTP sent to{" "}
          <strong>{pendingUser?.email || "your email"}</strong>.
        </p>

        <form onSubmit={handleVerifyOTP}>
          <label htmlFor="otp">Verification Code</label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}
      </div>
    </div>
  );
}

export default OTP;
