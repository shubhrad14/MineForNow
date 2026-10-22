import { useState, useRef } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const passwordFieldRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }
  
    try {
      setError("");
  
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }
  
      console.log("Login successful:", data);
  
      // Save logged-in user
      localStorage.setItem(
        "mineForNowUser",
        JSON.stringify(data.user)
      );
  
      navigate("/mode-selection");
  
    } catch (error) {
      console.error("Login error:", error);
  
      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          LEFT BRANDING
      ========================= */}

      <div className="login-brand">

        <button
          className="login-logo"
          onClick={() => navigate("/")}
        >
          <span>mine</span>
          <span>fornow</span>
        </button>

        <div className="login-brand-content">
          <p>WELCOME BACK</p>

          <h1>
            Borrow more.
            <br />
            Own less.
          </h1>

          <span>
            Log in to pick up where you left off and keep
            renting the things you need, when you need them.
          </span>
        </div>

        <div className="login-brand-decoration">
          <div className="login-decoration-circle"></div>
          <div className="login-decoration-small"></div>
        </div>

      </div>


      {/* =========================
          LOGIN FORM
      ========================= */}

      <div className="login-container">

        <div className="login-card">

          <div className="login-heading">
            <p>LOGIN</p>

            <h2>Login to MineForNow</h2>

            <span>Borrow what you need. Share what you own.</span>
          </div>


          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">Email address</label>

              <div className="login-input">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}

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
            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="login-input">
                <Lock size={18} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  ref={passwordFieldRef}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>


            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((current) => !current)}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>


            {/* Error */}
            {error && <div className="login-error">{error}</div>}


            <button type="submit" className="login-button">
              Login
            </button>

          </form>


          <div className="login-register">
            <span>Don't have an account?</span>

            <button onClick={() => navigate("/register")}>
              Create an account
            </button>
          </div>

          <div className="login-admin-switch">
            <span>Platform Administrator?</span>
            <button type="button" onClick={() => navigate("/admin/login")}>
              Sign in to Admin Portal →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;