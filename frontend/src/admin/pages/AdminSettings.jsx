import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Shield,
  IndianRupee,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Bell,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Menu,
  Calendar,
  ShieldCheck,
  Star,
  Check,
  HelpCircle,
  Key,
  MapPin,
  Package,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminSettings.css";

const DEFAULT_SETTINGS = {
  // Monetization
  commissionRate: 10,
  lateFeePerDay: 300,
  cancellationGraceHours: 24,
  depositHoldHours: 24,

  // Trust & Safety
  minTrustScoreInstantBook: 4.5,
  minTrustScoreWarning: 3.5,
  requireGovtId: true,
  maxConcurrentRentalsNewUsers: 2,
  autoVerifyApprovedOwners: true,

  // Platform Ops
  platformName: "MineForNow",
  supportEmail: "support@minefornow.com",
  supportPhone: "+91 98765 43210",
  maintenanceMode: false,
  emailNotifications: true,
  smsNotifications: true,

  // Admin Account
  adminName: "Super Administrator",
  adminEmail: "admin@minefornow.com",
};

function AdminSettings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const [activeTab, setActiveTab] = useState("monetization");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const [securityConfig, setSecurityConfig] = useState({
    question1: "What is the founding city or headquarters location of MineForNow?",
    answer1: "Mumbai",
    question2: "What was the first primary equipment category on the platform?",
    answer2: "Electronics",
    recoveryKey: "MFN-ADMIN-2026",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const savedSettings = localStorage.getItem("mineForNowPlatformSettings");
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedSec = localStorage.getItem("mineForNowAdminSecurity");
      if (savedSec) {
        setSecurityConfig((prev) => ({ ...prev, ...JSON.parse(savedSec) }));
      }
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem(
        "mineForNowPlatformSettings",
        JSON.stringify(settings)
      );

      setTimeout(() => {
        setIsSaving(false);
        showToast("Platform settings have been saved successfully!");
      }, 500);
    } catch (err) {
      setIsSaving(false);
      showToast("Failed to save settings. Please try again.", "error");
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!passwords.current) {
      showToast("Please enter current admin password", "error");
      return;
    }
    if (!passwords.newPass || passwords.newPass.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      showToast("New passwords do not match", "error");
      return;
    }

    setPasswords({ current: "", newPass: "", confirmPass: "" });
    showToast("Admin credentials updated successfully!");
  };

  const handleSaveSecurityQuestions = (e) => {
    e.preventDefault();
    if (
      !securityConfig.answer1.trim() ||
      !securityConfig.answer2.trim() ||
      !securityConfig.recoveryKey.trim()
    ) {
      showToast(
        "Please provide answers to both questions and a master recovery key",
        "error"
      );
      return;
    }

    try {
      localStorage.setItem(
        "mineForNowAdminSecurity",
        JSON.stringify(securityConfig)
      );
      showToast(
        "Security questions and master recovery key updated successfully!"
      );
    } catch (err) {
      showToast("Failed to save security questions", "error");
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to restore platform settings to defaults?"
      )
    ) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem(
        "mineForNowPlatformSettings",
        JSON.stringify(DEFAULT_SETTINGS)
      );
      showToast("Settings reset to defaults.");
    }
  };

  return (
    <div
      className={`admin-settings-page ${sidebarOpen ? "sidebar-is-open" : ""}`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-settings-content">
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className={`admin-settings-toast ${toastType}`}>
            {toastType === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER */}
        <header className="admin-settings-header">
          <div className="admin-settings-header-left">
            <button
              className="admin-menu-button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Open admin menu"
            >
              <Menu size={24} />
            </button>

            <div className="admin-settings-title">
              <p>PLATFORM CONFIGURATION</p>
              <h1>Platform Settings</h1>
              <span>
                Configure rental commissions, deposit escrow, trust score thresholds, operational controls, and administrative security.
              </span>
            </div>
          </div>

          <div className="admin-settings-header-right">
            <div className="admin-settings-date">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>

            <button
              type="button"
              className="btn-reset-defaults"
              onClick={handleResetDefaults}
            >
              <RefreshCw size={14} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </header>

        {/* SETTINGS TABS & MAIN LAYOUT */}
        <div className="settings-layout-grid">
          {/* LEFT NAVIGATION TABS */}
          <nav className="settings-nav-sidebar">
            <button
              className={`settings-tab-btn ${
                activeTab === "monetization" ? "active" : ""
              }`}
              onClick={() => setActiveTab("monetization")}
            >
              <IndianRupee size={18} />
              <div className="tab-text">
                <strong>Monetization & Fees</strong>
                <span>Commission & penalty rates</span>
              </div>
            </button>

            <button
              className={`settings-tab-btn ${
                activeTab === "trust" ? "active" : ""
              }`}
              onClick={() => setActiveTab("trust")}
            >
              <ShieldCheck size={18} />
              <div className="tab-text">
                <strong>Trust & Verification</strong>
                <span>Airbnb-style trust thresholds</span>
              </div>
            </button>

            <button
              className={`settings-tab-btn ${
                activeTab === "operations" ? "active" : ""
              }`}
              onClick={() => setActiveTab("operations")}
            >
              <Sliders size={18} />
              <div className="tab-text">
                <strong>Platform Operations</strong>
                <span>Contact, alerts & system mode</span>
              </div>
            </button>

            <button
              className={`settings-tab-btn ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} />
              <div className="tab-text">
                <strong>Admin Security</strong>
                <span>Access & credentials</span>
              </div>
            </button>
          </nav>

          {/* RIGHT SETTINGS PANEL */}
          <div className="settings-panel-container">
            {/* MONETIZATION & FEES */}
            {activeTab === "monetization" && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="head-icon icon-rupee">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <h2>Monetization & Fee Policies</h2>
                    <p>
                      Set marketplace commission cuts and security deposit escrow rules.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="commissionRate">
                        Platform Commission Cut (%)
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="commissionRate"
                          type="number"
                          min="0"
                          max="50"
                          value={settings.commissionRate}
                          onChange={(e) =>
                            handleInputChange(
                              "commissionRate",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">%</span>
                      </div>
                      <small className="form-hint">
                        Deducted from each completed booking prior to owner payout.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="lateFeePerDay">
                        Late Return Penalty (₹/day)
                      </label>
                      <div className="input-with-addon">
                        <span className="input-addon-prefix">₹</span>
                        <input
                          id="lateFeePerDay"
                          type="number"
                          min="50"
                          step="50"
                          value={settings.lateFeePerDay}
                          onChange={(e) =>
                            handleInputChange(
                              "lateFeePerDay",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <small className="form-hint">
                        Charged to borrower per 24 hours of overdue equipment retention.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cancellationGraceHours">
                        Free Cancellation Window
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="cancellationGraceHours"
                          type="number"
                          min="0"
                          max="168"
                          value={settings.cancellationGraceHours}
                          onChange={(e) =>
                            handleInputChange(
                              "cancellationGraceHours",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">Hours</span>
                      </div>
                      <small className="form-hint">
                        Hours before booking start time that borrower can cancel with full refund.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="depositHoldHours">
                        Deposit Escrow Release Window
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="depositHoldHours"
                          type="number"
                          min="6"
                          max="72"
                          value={settings.depositHoldHours}
                          onChange={(e) =>
                            handleInputChange(
                              "depositHoldHours",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">Hours</span>
                      </div>
                      <small className="form-hint">
                        Automated refund time after owner marks item return complete.
                      </small>
                    </div>
                  </div>

                  <div className="settings-card-actions">
                    <button
                      type="submit"
                      className="btn-save-settings"
                      disabled={isSaving}
                    >
                      <Save size={16} />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TRUST & VERIFICATION */}
            {activeTab === "trust" && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="head-icon icon-trust">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2>Trust Score & Community Safety</h2>
                    <p>
                      Airbnb-inspired peer evaluation criteria and safety gating.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="minTrustScoreInstantBook">
                        Min. Trust Score for Instant Booking
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="minTrustScoreInstantBook"
                          type="number"
                          step="0.1"
                          min="3.0"
                          max="5.0"
                          value={settings.minTrustScoreInstantBook}
                          onChange={(e) =>
                            handleInputChange(
                              "minTrustScoreInstantBook",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">★ / 5.0</span>
                      </div>
                      <small className="form-hint">
                        Renters below this score require manual equipment owner approval.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="minTrustScoreWarning">
                        Disciplinary Alert Threshold
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="minTrustScoreWarning"
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="4.0"
                          value={settings.minTrustScoreWarning}
                          onChange={(e) =>
                            handleInputChange(
                              "minTrustScoreWarning",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">★ / 5.0</span>
                      </div>
                      <small className="form-hint">
                        Accounts below this score are automatically flagged for admin review.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="maxConcurrentRentalsNewUsers">
                        Max Concurrent Rentals (New Renters)
                      </label>
                      <div className="input-with-addon">
                        <input
                          id="maxConcurrentRentalsNewUsers"
                          type="number"
                          min="1"
                          max="10"
                          value={settings.maxConcurrentRentalsNewUsers}
                          onChange={(e) =>
                            handleInputChange(
                              "maxConcurrentRentalsNewUsers",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="input-addon">Items</span>
                      </div>
                      <small className="form-hint">
                        Applies until a borrower successfully completes 3 verified rentals.
                      </small>
                    </div>
                  </div>

                  <div className="toggles-list">
                    <div className="toggle-row">
                      <div>
                        <strong>Mandatory Govt ID Verification</strong>
                        <p>
                          Require Aadhaar / Govt ID upload before a user can book gear.
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.requireGovtId}
                          onChange={(e) =>
                            handleInputChange("requireGovtId", e.target.checked)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <strong>Fast-Track Verified Equipment Owners</strong>
                        <p>
                          Automatically publish listings from owners with 5-star ratings.
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.autoVerifyApprovedOwners}
                          onChange={(e) =>
                            handleInputChange(
                              "autoVerifyApprovedOwners",
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-card-actions">
                    <button
                      type="submit"
                      className="btn-save-settings"
                      disabled={isSaving}
                    >
                      <Save size={16} />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PLATFORM OPERATIONS */}
            {activeTab === "operations" && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="head-icon icon-ops">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h2>Platform Operations & Contact</h2>
                    <p>
                      Configure public communications and system maintenance.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="platformName">Marketplace Name</label>
                      <input
                        id="platformName"
                        type="text"
                        value={settings.platformName}
                        onChange={(e) =>
                          handleInputChange("platformName", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="supportEmail">Support Email</label>
                      <input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) =>
                          handleInputChange("supportEmail", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="supportPhone">Support Helpline</label>
                      <input
                        id="supportPhone"
                        type="text"
                        value={settings.supportPhone}
                        onChange={(e) =>
                          handleInputChange("supportPhone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="toggles-list">
                    <div className="toggle-row">
                      <div>
                        <strong>Automated Email Alerts</strong>
                        <p>
                          Send instant dispatch updates and return reminders to borrowers and owners.
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="toggle-row">
                      <div>
                        <strong>SMS Return Reminders</strong>
                        <p>
                          Send SMS alerts 4 hours before rental expiry to prevent late returns.
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "smsNotifications",
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="toggle-row maintenance-row">
                      <div>
                        <strong className="text-warning">Maintenance Mode</strong>
                        <p>
                          Temporarily disable new rental bookings while performing system updates.
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) =>
                            handleInputChange(
                              "maintenanceMode",
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-card-actions">
                    <button
                      type="submit"
                      className="btn-save-settings"
                      disabled={isSaving}
                    >
                      <Save size={16} />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ADMIN SECURITY & CREDENTIALS */}
            {activeTab === "security" && (
              <div className="settings-card">
                <div className="settings-card-head">
                  <div className="head-icon icon-security">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2>Administrator Credentials</h2>
                    <p>
                      Manage authorized login information and platform password.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Admin Profile</label>
                      <input
                        type="text"
                        value={settings.adminName}
                        disabled
                        className="input-disabled"
                      />
                      <small className="form-hint">
                        Super Administrator (Full Privileges)
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Admin Login Email</label>
                      <input
                        type="email"
                        value={settings.adminEmail}
                        disabled
                        className="input-disabled"
                      />
                      <small className="form-hint">
                        Contact support to change root administrative email.
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentPass">Current Password</label>
                      <input
                        id="currentPass"
                        name="current"
                        type="password"
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPass">New Password</label>
                      <input
                        id="newPass"
                        name="newPass"
                        type="password"
                        placeholder="At least 6 characters"
                        value={passwords.newPass}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPass">Confirm New Password</label>
                      <input
                        id="confirmPass"
                        name="confirmPass"
                        type="password"
                        placeholder="Re-type new password"
                        value={passwords.confirmPass}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>

                  <div className="settings-card-actions">
                    <button type="submit" className="btn-save-settings">
                      <Lock size={16} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>

                {/* SECURITY QUESTIONS FOR FORGOT PASSWORD RECOVERY */}
                <div className="security-questions-settings-section" style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-light, #e8e2d5)" }}>
                  <div className="settings-card-head" style={{ borderBottom: "none", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="head-icon icon-trust">
                      <Key size={20} />
                    </div>
                    <div>
                      <h2>Forgot Password Security Questions</h2>
                      <p>
                        Used to verify administrator identity during password reset instead of email OTPs.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSecurityQuestions}>
                    <div className="form-grid">
                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="sec-q1">Security Question 1</label>
                        <input
                          id="sec-q1"
                          type="text"
                          value={securityConfig.question1}
                          onChange={(e) =>
                            setSecurityConfig({
                              ...securityConfig,
                              question1: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="sec-a1">Registered Answer 1</label>
                        <input
                          id="sec-a1"
                          type="text"
                          placeholder="Enter registered answer"
                          value={securityConfig.answer1}
                          onChange={(e) =>
                            setSecurityConfig({
                              ...securityConfig,
                              answer1: e.target.value,
                            })
                          }
                        />
                        <small className="form-hint">Case-insensitive matching</small>
                      </div>

                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="sec-q2">Security Question 2</label>
                        <input
                          id="sec-q2"
                          type="text"
                          value={securityConfig.question2}
                          onChange={(e) =>
                            setSecurityConfig({
                              ...securityConfig,
                              question2: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="sec-a2">Registered Answer 2</label>
                        <input
                          id="sec-a2"
                          type="text"
                          placeholder="Enter registered answer"
                          value={securityConfig.answer2}
                          onChange={(e) =>
                            setSecurityConfig({
                              ...securityConfig,
                              answer2: e.target.value,
                            })
                          }
                        />
                        <small className="form-hint">Case-insensitive matching</small>
                      </div>

                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="sec-key">Master Administrator Recovery Key</label>
                        <input
                          id="sec-key"
                          type="text"
                          value={securityConfig.recoveryKey}
                          onChange={(e) =>
                            setSecurityConfig({
                              ...securityConfig,
                              recoveryKey: e.target.value,
                            })
                          }
                        />
                        <small className="form-hint">High-entropy cryptographic emergency recovery code</small>
                      </div>
                    </div>

                    <div className="settings-card-actions">
                      <button type="submit" className="btn-save-settings">
                        <Save size={16} />
                        <span>Save Security Questions</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminSettings;
