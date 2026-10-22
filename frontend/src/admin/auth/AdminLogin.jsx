import { useState, useRef, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("admin-page");

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

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

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("Please enter your admin email address.");
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

    // Store verified admin session
    const adminSession = {
      id: "ADM_001",
      email: formData.email,
      name: "Super Administrator",
      role: "Super Admin",
      token: "adm_auth_" + Date.now(),
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("mineForNowAdmin", JSON.stringify(adminSession));

    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-login-page">

      {/* =========================
          LEFT BRANDING
      ========================= */}

      <div className="admin-login-brand">

        <button
          className="admin-login-logo"
          onClick={() => navigate("/")}
        >
          <span>mine</span>
          <span>fornow</span>
        </button>


        <div className="admin-login-brand-content">

          <p>ADMIN PORTAL</p>

          <h1>
            Manage.
            <br />
            Simplify.
            <br />
            Grow.
          </h1>

          <span>
            Manage users, rental listings, bookings and
            platform activity from one place.
          </span>

        </div>


        <div className="admin-login-brand-decoration">

          <div className="admin-decoration-circle"></div>

          <div className="admin-decoration-small"></div>

        </div>

      </div>


      {/* =========================
          ADMIN LOGIN FORM
      ========================= */}

      <div className="admin-login-container">

        <div className="admin-login-card">

          <div className="admin-login-heading">

            <div className="admin-login-icon">
              <ShieldCheck size={22} />
            </div>

            <p>ADMIN LOGIN</p>

            <h2>Welcome, Admin</h2>

            <span>
              Sign in to access the MineForNow administration panel.
            </span>

          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="admin-login-field">

              <label htmlFor="admin-email">
                Admin email address
              </label>

              <div className="admin-login-input">

                <Mail size={18} />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      passwordFieldRef.current?.focus();
                    }
                  }}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-login-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-login-input">

                <Lock size={18} />

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  ref={passwordFieldRef}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
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


            {/* OPTIONS */}

            <div className="admin-login-options">

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                Remember me

              </label>


              <button
                type="button"
                onClick={() => navigate("/admin/forgot-password")}
              >
                Forgot password?
              </button>

            </div>


            {/* ERROR */}

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}


            {/* LOGIN */}

            <button
              type="submit"
              className="admin-login-button"
            >
              Login to Admin Panel
            </button>

          </form>


          {/* SECURITY NOTE */}

          <div className="admin-login-security">

            <ShieldCheck size={15} />

            <span>
              This area is restricted to authorized administrators.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
