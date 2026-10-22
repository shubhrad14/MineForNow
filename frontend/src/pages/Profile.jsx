import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Package,
  CreditCard,
  Heart,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";
import "./Profile.css";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function Profile() {
  const navigate = useNavigate();

  // Renter Trust Score & Owner Reviews (Airbnb-Style)
  const [renterTrust, setRenterTrust] = useState(() => {
    try {
      const store = JSON.parse(
        localStorage.getItem("mineForNowCustomerTrustScores") || "{}"
      );
      const user = JSON.parse(localStorage.getItem("mineForNowUser") || "null");
      const userKey = String(
        user?.id || user?.email || user?.name || ""
      ).toLowerCase().trim();

      if (userKey && store[userKey]) return store[userKey];

      const found = Object.entries(store).find(([k]) =>
        userKey && (k.includes(userKey) || userKey.includes(k))
      );
      if (found) return found[1];

      // Default reputation for customer
      return {
        score: 4.9,
        count: 2,
        badge: "Super Renter",
        reviews: [
          {
            ownerName: "Sameer V. (Camera Owner)",
            itemName: "Sony Alpha A7 IV Camera Kit",
            overall: 5.0,
            care: 5,
            punctuality: 5,
            communication: 5,
            tags: ["Returned Spotless", "On-Time Handover", "Highly Recommended"],
            comment: "Exceptional borrower! Returned the gear in immaculate condition and on time. Would gladly rent again.",
            ratedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          }
        ]
      };
    } catch {
      return { score: 5.0, count: 1, badge: "Super Renter", reviews: [] };
    }
  });

  // Load basic user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mineForNowUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Profile data
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    role: "Borrower",
    profileImage: "",
    isVerified: false,
  });

  // Section edit states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Draft states
  const [draftPersonal, setDraftPersonal] = useState({ firstName: "", lastName: "", gender: "" });
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPhone, setDraftPhone] = useState("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'addresses' | 'verification'

  // Loading & Feedback
  const [savingSection, setSavingSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // ==========================================
  // MANAGE ADDRESSES STATE
  // ==========================================
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const initialAddressForm = {
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    altPhone: "",
    type: "Home", // "Home" | "Work"
  };

  const [addressForm, setAddressForm] = useState(initialAddressForm);

  // Load saved addresses from localStorage
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem("mineForNowAddresses");
      if (stored) return JSON.parse(stored);
      // Default demo address if none exists
      return [
        {
          id: "addr_1",
          name: currentUser?.name || "Member",
          phone: currentUser?.phone || "9876543210",
          pincode: "400001",
          locality: "Fort, South Mumbai",
          street: "Flat 402, Sea View Apartments, MG Road",
          city: "Mumbai",
          state: "Maharashtra",
          landmark: "Near High Court",
          altPhone: "",
          type: "Home",
          isDefault: true,
        },
      ];
    } catch {
      return [];
    }
  });

  // Sync addresses to localStorage
  const saveAddressesToStorage = (addresses) => {
    setSavedAddresses(addresses);
    localStorage.setItem("mineForNowAddresses", JSON.stringify(addresses));
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch full user profile
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userId = currentUser.id || currentUser._id;
        const token = localStorage.getItem("mineForNowToken");

        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`http://localhost:5000/api/auth/profile?id=${userId}`, {
          method: "GET",
          headers,
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          const u = data.user;
          const initialData = {
            firstName: u.firstName || (u.name ? u.name.split(" ")[0] : ""),
            lastName: u.lastName || (u.name ? u.name.split(" ").slice(1).join(" ") : ""),
            email: u.email || currentUser.email || "",
            phone: u.phone || currentUser.phone || "",
            gender: u.gender || "",
            role: u.role || currentUser.role || "Borrower",
            profileImage: u.profileImage || "",
            isVerified: Boolean(u.isVerified),
          };

          setProfile(initialData);
          setDraftPersonal({
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            gender: initialData.gender,
          });
          setDraftEmail(initialData.email);
          setDraftPhone(initialData.phone);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchUserProfile();
  }, [currentUser, navigate]);

  // Save Personal Info
  const handleSavePersonal = async () => {
    if (!draftPersonal.firstName.trim()) {
      setToast({ type: "error", message: "First name cannot be empty." });
      return;
    }

    try {
      setSavingSection("personal");
      const userId = currentUser.id || currentUser._id;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          firstName: draftPersonal.firstName.trim(),
          lastName: draftPersonal.lastName.trim(),
          gender: draftPersonal.gender,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({
          ...prev,
          firstName: draftPersonal.firstName.trim(),
          lastName: draftPersonal.lastName.trim(),
          gender: draftPersonal.gender,
        }));
        const updatedName = `${draftPersonal.firstName.trim()} ${draftPersonal.lastName.trim()}`.trim();
        const updated = { ...currentUser, name: updatedName };
        localStorage.setItem("mineForNowUser", JSON.stringify(updated));
        setCurrentUser(updated);
        setIsEditingPersonal(false);
        setToast({ type: "success", message: "Personal information saved!" });
      } else {
        setToast({ type: "error", message: data.message || "Failed to update profile." });
      }
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSavingSection(null);
    }
  };

  // Save Email
  const handleSaveEmail = async () => {
    if (!draftEmail.trim() || !/\S+@\S+\.\S+/.test(draftEmail)) {
      setToast({ type: "error", message: "Enter a valid email address." });
      return;
    }
    try {
      setSavingSection("email");
      const userId = currentUser.id || currentUser._id;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, email: draftEmail.trim() }),
      });
      if (res.ok) {
        setProfile((prev) => ({ ...prev, email: draftEmail.trim() }));
        const updated = { ...currentUser, email: draftEmail.trim() };
        localStorage.setItem("mineForNowUser", JSON.stringify(updated));
        setCurrentUser(updated);
        setIsEditingEmail(false);
        setToast({ type: "success", message: "Email updated successfully!" });
      }
    } catch {
      setToast({ type: "error", message: "Error updating email." });
    } finally {
      setSavingSection(null);
    }
  };

  // Save Phone
  const handleSavePhone = async () => {
    const clean = draftPhone.trim();
    if (clean && clean.replace(/\D/g, "").length < 10) {
      setToast({ type: "error", message: "Enter a valid 10-digit mobile number." });
      return;
    }
    try {
      setSavingSection("phone");
      const userId = currentUser.id || currentUser._id;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, phone: clean }),
      });
      if (res.ok) {
        setProfile((prev) => ({ ...prev, phone: clean }));
        const updated = { ...currentUser, phone: clean };
        localStorage.setItem("mineForNowUser", JSON.stringify(updated));
        setCurrentUser(updated);
        setIsEditingPhone(false);
        setToast({ type: "success", message: "Mobile number updated!" });
      }
    } catch {
      setToast({ type: "error", message: "Error updating mobile number." });
    } finally {
      setSavingSection(null);
    }
  };

  // ==========================================
  // USE MY CURRENT LOCATION (GEOLOCATION API)
  // ==========================================
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setToast({ type: "error", message: "Geolocation is not supported by your browser." });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            setAddressForm((prev) => ({
              ...prev,
              pincode: addr.postcode || prev.pincode,
              city: addr.city || addr.town || addr.village || addr.county || prev.city,
              state: addr.state || prev.state,
              locality: addr.suburb || addr.neighbourhood || addr.road || prev.locality,
              street: [addr.road, addr.suburb].filter(Boolean).join(", ") || prev.street,
            }));
            setToast({ type: "success", message: "Location detected and filled!" });
          } else {
            setToast({ type: "success", message: "GPS coordinates captured." });
          }
        } catch {
          setToast({ type: "error", message: "Could not auto-fill location. Please enter manually." });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setToast({ type: "error", message: "Location permission denied. Please enter manually." });
      },
      { timeout: 10000 }
    );
  };

  // ==========================================
  // SAVE / UPDATE ADDRESS
  // ==========================================
  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (!addressForm.name.trim() || !addressForm.phone.trim() || !addressForm.pincode.trim() || !addressForm.street.trim() || !addressForm.city.trim()) {
      setToast({ type: "error", message: "Please fill in all mandatory fields (Name, Phone, Pincode, Address, City)." });
      return;
    }

    if (editingAddressId) {
      // Edit existing
      const updated = savedAddresses.map((addr) =>
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
      );
      saveAddressesToStorage(updated);
      setToast({ type: "success", message: "Address updated successfully!" });
    } else {
      // Add new
      const newAddr = {
        ...addressForm,
        id: `addr_${Date.now()}`,
        isDefault: savedAddresses.length === 0,
      };
      saveAddressesToStorage([...savedAddresses, newAddr]);
      setToast({ type: "success", message: "New address added successfully!" });
    }

    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(initialAddressForm);
  };

  const handleEditAddress = (addr) => {
    setAddressForm({ ...addr });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    saveAddressesToStorage(updated);
    setToast({ type: "success", message: "Address removed." });
  };

  const handleSetDefaultAddress = (id) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveAddressesToStorage(updated);
    setToast({ type: "success", message: "Default delivery address updated!" });
  };

  const handleLogout = () => {
    localStorage.removeItem("mineForNowUser");
    localStorage.removeItem("mineForNowToken");
    navigate("/login");
  };

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || currentUser?.name || "Member";
  const userInitials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName ? profile.lastName[0] : ""}`.toUpperCase()
    : "U";

  return (
    <div className="profile-page">
      {toast && (
        <div className={`profile-toast profile-toast-${toast.type}`}>
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
          <button className="profile-toast-close" onClick={() => setToast(null)}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className="profile-container">
        {/* ================================================= */}
        {/* LEFT SIDEBAR */}
        {/* ================================================= */}
        <aside className="profile-sidebar">
          <div className="profile-greeting-card">
            <div className="profile-avatar-wrapper">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={fullName} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <span>{userInitials}</span>
                </div>
              )}
              <div className="profile-verified-badge">
                <ShieldCheck
                  size={14}
                  className={profile.isVerified ? "verified-icon" : "unverified-icon"}
                />
              </div>
            </div>

            <div className="profile-greeting-info">
              <span className="profile-greeting-sub">Hello,</span>
              <h2 className="profile-greeting-name">{fullName}</h2>
              <span className="profile-role-pill">{profile.role}</span>
              <div
                className="profile-trust-pill"
                onClick={() => setActiveTab("trust")}
                title="Click to view verified community trust score & reviews from owners"
              >
                <ShieldCheck size={13} />
                <span>{renterTrust.score}★ {renterTrust.badge}</span>
              </div>
            </div>
          </div>

          <nav className="profile-nav-card">
            <div className="profile-nav-group">
              <button
                type="button"
                className="profile-nav-header-btn"
                onClick={() => navigate("/my-rentals")}
              >
                <div className="profile-nav-header-left">
                  <Package size={20} className="nav-icon" />
                  <span>MY RENTALS</span>
                </div>
                <ChevronRight size={18} className="nav-chevron" />
              </button>
            </div>

            <div className="profile-nav-group">
              <div className="profile-nav-heading">
                <UserRound size={19} className="nav-icon" />
                <span>ACCOUNT SETTINGS</span>
              </div>
              <ul className="profile-nav-list">
                <li>
                  <button
                    type="button"
                    className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile Information
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`profile-nav-item ${activeTab === "addresses" ? "active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    Manage Addresses
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`profile-nav-item ${activeTab === "verification" ? "active" : ""}`}
                    onClick={() => setActiveTab("verification")}
                  >
                    Identity & Verification
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`profile-nav-item ${activeTab === "trust" ? "active" : ""}`}
                    onClick={() => setActiveTab("trust")}
                  >
                    Renter Trust & Reviews
                  </button>
                </li>
              </ul>
            </div>

            <div className="profile-nav-group">
              <div className="profile-nav-heading">
                <Heart size={19} className="nav-icon" />
                <span>MY STUFF</span>
              </div>
              <ul className="profile-nav-list">
                <li>
                  <button type="button" className="profile-nav-item" onClick={() => navigate("/wishlist")}>
                    My Wishlist
                  </button>
                </li>
                <li>
                  <button type="button" className="profile-nav-item" onClick={() => navigate("/owner-dashboard")}>
                    Owner Dashboard & Listings
                  </button>
                </li>
              </ul>
            </div>

            <div className="profile-nav-group profile-nav-logout">
              <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* ================================================= */}
        {/* RIGHT MAIN PANEL */}
        {/* ================================================= */}
        <main className="profile-main-panel">
          {/* TAB: RENTER TRUST & REVIEWS FROM OWNERS */}
          {activeTab === "trust" && (
            <div className="profile-content-card">
              <div className="profile-section-header">
                <div>
                  <h3 className="profile-section-title">Verified Renter Trust & Reputation</h3>
                  <p className="profile-section-desc">
                    Airbnb-style community ratings and feedback awarded to you by equipment owners upon return.
                  </p>
                </div>
              </div>

              {/* TRUST HERO CARD */}
              <div className="profile-trust-hero">
                <div className="trust-hero-score-group">
                  <div className="trust-shield-badge-lg">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="trust-score-title">
                      <span className="trust-score-num">{renterTrust.score}</span>
                      <span className="trust-score-max">/ 5.0</span>
                    </div>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-muted, #8a8776)" }}>
                      Based on <strong>{renterTrust.count}</strong> verified rental return(s)
                    </p>
                  </div>
                </div>

                <div className="trust-tier-badge">
                  <Award size={15} />
                  <span>{renterTrust.badge}</span>
                </div>
              </div>

              {/* 3 PILLARS SUMMARY */}
              <div className="profile-trust-pillars-card">
                <div className="trust-metric-box">
                  <span>1. Gear Care & Condition</span>
                  <strong>
                    <Star size={16} fill="#2e6930" color="#2e6930" />
                    {renterTrust.score} / 5.0
                  </strong>
                </div>

                <div className="trust-metric-box">
                  <span>2. Punctuality & Return</span>
                  <strong>
                    <Star size={16} fill="#2e6930" color="#2e6930" />
                    {renterTrust.score} / 5.0
                  </strong>
                </div>

                <div className="trust-metric-box">
                  <span>3. Communication</span>
                  <strong>
                    <Star size={16} fill="#2e6930" color="#2e6930" />
                    {renterTrust.score} / 5.0
                  </strong>
                </div>
              </div>

              {/* REVIEWS & NOTES FROM OWNERS */}
              <section className="profile-section" style={{ marginTop: "24px" }}>
                <div className="profile-section-header">
                  <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-heading, #4a4f3a)" }}>
                    Feedback & Notes from Item Owners
                  </h4>
                </div>

                {(!renterTrust.reviews || renterTrust.reviews.length === 0) ? (
                  <p style={{ fontSize: "13.5px", color: "var(--text-muted, #8a8776)", fontStyle: "italic" }}>
                    No reviews yet. When owners mark your rentals returned, their feedback and trust notes will appear here.
                  </p>
                ) : (
                  <div className="profile-trust-reviews-list">
                    {renterTrust.reviews.map((rev, idx) => (
                      <div className="profile-owner-review-card" key={idx}>
                        <div className="owner-review-top">
                          <div className="owner-review-meta">
                            <strong>{rev.ownerName || "Item Owner"}</strong>
                            <span>Rented: {rev.itemName || "Rental Item"}</span>
                          </div>
                          <span className="owner-review-score">
                            ★ {rev.overall} / 5.0
                          </span>
                        </div>

                        {rev.comment && (
                          <p className="owner-review-quote">
                            "{rev.comment}"
                          </p>
                        )}

                        {rev.tags && rev.tags.length > 0 && (
                          <div className="owner-review-tags">
                            {rev.tags.map((tag) => (
                              <span key={tag} className="owner-review-tag-pill">
                                ✓ {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div className="profile-content-card">
              <section className="profile-section">
                <div className="profile-section-header">
                  <h3 className="profile-section-title">Personal Information</h3>
                  <button
                    type="button"
                    className="profile-edit-toggle"
                    onClick={() => {
                      if (isEditingPersonal) {
                        setDraftPersonal({
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          gender: profile.gender,
                        });
                        setIsEditingPersonal(false);
                      } else {
                        setIsEditingPersonal(true);
                      }
                    }}
                  >
                    {isEditingPersonal ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-input-group">
                    <label className="profile-label">First Name</label>
                    <input
                      type="text"
                      className={`profile-input ${!isEditingPersonal ? "disabled" : ""}`}
                      value={draftPersonal.firstName}
                      onChange={(e) =>
                        setDraftPersonal({ ...draftPersonal, firstName: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="profile-input-group">
                    <label className="profile-label">Last Name</label>
                    <input
                      type="text"
                      className={`profile-input ${!isEditingPersonal ? "disabled" : ""}`}
                      value={draftPersonal.lastName}
                      onChange={(e) =>
                        setDraftPersonal({ ...draftPersonal, lastName: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="profile-gender-group">
                  <span className="profile-sublabel">Your Gender</span>
                  <div className="profile-radio-row">
                    {["Male", "Female", "Other"].map((gen) => (
                      <label
                        key={gen}
                        className={`profile-radio-label ${
                          draftPersonal.gender === gen ? "selected" : ""
                        } ${!isEditingPersonal ? "disabled" : ""}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gen}
                          checked={draftPersonal.gender === gen}
                          onChange={(e) =>
                            isEditingPersonal &&
                            setDraftPersonal({ ...draftPersonal, gender: e.target.value })
                          }
                          disabled={!isEditingPersonal}
                        />
                        <span>{gen}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isEditingPersonal && (
                  <div className="profile-save-row">
                    <button
                      type="button"
                      className="profile-btn-primary"
                      onClick={handleSavePersonal}
                      disabled={savingSection === "personal"}
                    >
                      {savingSection === "personal" ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </section>

              {/* Email Section */}
              <section className="profile-section">
                <div className="profile-section-header">
                  <div className="profile-header-with-badge">
                    <h3 className="profile-section-title">Email Address</h3>
                    {profile.isVerified && (
                      <span className="profile-status-badge verified">
                        <CheckCircle size={13} /> Verified
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="profile-edit-toggle"
                    onClick={() => {
                      if (isEditingEmail) {
                        setDraftEmail(profile.email);
                        setIsEditingEmail(false);
                      } else {
                        setIsEditingEmail(true);
                      }
                    }}
                  >
                    {isEditingEmail ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="profile-input-group single-line">
                  <input
                    type="email"
                    className={`profile-input ${!isEditingEmail ? "disabled" : ""}`}
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    disabled={!isEditingEmail}
                    placeholder="Enter email address"
                  />
                </div>

                {isEditingEmail && (
                  <div className="profile-save-row">
                    <button
                      type="button"
                      className="profile-btn-primary"
                      onClick={handleSaveEmail}
                      disabled={savingSection === "email"}
                    >
                      {savingSection === "email" ? "Updating..." : "Save Email"}
                    </button>
                  </div>
                )}
              </section>

              {/* Mobile Number Section */}
              <section className="profile-section">
                <div className="profile-section-header">
                  <h3 className="profile-section-title">Mobile Number</h3>
                  <button
                    type="button"
                    className="profile-edit-toggle"
                    onClick={() => {
                      if (isEditingPhone) {
                        setDraftPhone(profile.phone);
                        setIsEditingPhone(false);
                      } else {
                        setIsEditingPhone(true);
                      }
                    }}
                  >
                    {isEditingPhone ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="profile-input-group single-line phone-input-box">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className={`profile-input phone-field ${!isEditingPhone ? "disabled" : ""}`}
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                    disabled={!isEditingPhone}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                {isEditingPhone && (
                  <div className="profile-save-row">
                    <button
                      type="button"
                      className="profile-btn-primary"
                      onClick={handleSavePhone}
                      disabled={savingSection === "phone"}
                    >
                      {savingSection === "phone" ? "Updating..." : "Save Mobile"}
                    </button>
                  </div>
                )}
              </section>

              {/* 4. FAQS */}
              <section className="profile-faqs-section">
                <h4 className="profile-faqs-title">FAQs</h4>

                <div className="profile-faq-item">
                  <h5>What happens when I update my email address (or mobile number)?</h5>
                  <p>
                    Your login email id (or mobile number) changes. Likewise, you will receive all
                    your booking confirmations, security deposit refunds, and OTPs on your updated
                    contact details.
                  </p>
                </div>

                <div className="profile-faq-item">
                  <h5>When will my MineForNow account be updated with the new details?</h5>
                  <p>
                    It happens immediately as soon as you confirm and save your changes.
                  </p>
                </div>

                <div className="profile-faq-item">
                  <h5>How does identity verification work on MineForNow?</h5>
                  <p>
                    MineForNow verifies borrowers and lenders to protect high-value equipment.
                    Verified members get quicker approvals and waiver of high security deposits.
                  </p>
                </div>

                <div className="profile-faq-item">
                  <h5>Does updating my personal info cancel my active rentals?</h5>
                  <p>
                    No. Your ongoing and upcoming rental bookings remain fully valid and safe.
                  </p>
                </div>
              </section>

              {/* 5. BOTTOM ACTIONS */}
              <div className="profile-bottom-actions">
                <button
                  type="button"
                  className="profile-link-btn deactivate"
                  onClick={() => setShowDeactivateModal(true)}
                >
                  Deactivate Account
                </button>
                <button
                  type="button"
                  className="profile-link-btn delete"
                  onClick={() => setShowDeactivateModal(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MANAGE ADDRESSES (MATCHING YOUR SCREENSHOT) */}
          {/* ========================================================= */}
          {activeTab === "addresses" && (
            <div className="profile-content-card">
              <h3 className="manage-addresses-main-title">Manage Addresses</h3>

              {/* Add New Address Accordion / Button */}
              {!showAddressForm ? (
                <button
                  type="button"
                  className="add-address-trigger-card"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      ...initialAddressForm,
                      name: fullName,
                      phone: profile.phone || "",
                    });
                    setShowAddressForm(true);
                  }}
                >
                  <Plus size={18} className="add-icon" />
                  <span>ADD A NEW ADDRESS</span>
                </button>
              ) : (
                /* Address Form Box matching your screenshot */
                <div className="address-form-box">
                  <span className="address-form-heading">
                    {editingAddressId ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
                  </span>

                  {/* Use Current Location Button */}
                  <button
                    type="button"
                    className="use-location-btn"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                  >
                    <Navigation size={16} />
                    <span>{isLocating ? "Detecting location..." : "Use my current location"}</span>
                  </button>

                  <form onSubmit={handleSaveAddress} className="address-form-grid">
                    {/* Row 1: Name & Mobile */}
                    <div className="address-grid-row">
                      <div className="address-field">
                        <input
                          type="text"
                          placeholder="Name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="address-field">
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2: Pincode & Locality */}
                    <div className="address-grid-row">
                      <div className="address-field">
                        <input
                          type="text"
                          placeholder="Pincode"
                          maxLength={6}
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="address-field">
                        <input
                          type="text"
                          placeholder="Locality"
                          value={addressForm.locality}
                          onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Address (Area and Street) */}
                    <div className="address-grid-row full-width">
                      <div className="address-field">
                        <textarea
                          placeholder="Address (Area and Street)"
                          rows={3}
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 4: City/District/Town & State */}
                    <div className="address-grid-row">
                      <div className="address-field">
                        <input
                          type="text"
                          placeholder="City/District/Town"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="address-field state-select-field">
                        <label className="state-label">State</label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        >
                          <option value="">--Select State--</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Landmark & Alternate Phone */}
                    <div className="address-grid-row">
                      <div className="address-field">
                        <input
                          type="text"
                          placeholder="Landmark (Optional)"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        />
                      </div>
                      <div className="address-field">
                        <input
                          type="tel"
                          placeholder="Alternate Phone (Optional)"
                          maxLength={10}
                          value={addressForm.altPhone}
                          onChange={(e) => setAddressForm({ ...addressForm, altPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Address Type Radio */}
                    <div className="address-type-group">
                      <span className="address-type-title">Address Type</span>
                      <div className="address-type-radios">
                        <label className="address-type-label">
                          <input
                            type="radio"
                            name="addressType"
                            value="Home"
                            checked={addressForm.type === "Home"}
                            onChange={() => setAddressForm({ ...addressForm, type: "Home" })}
                          />
                          <span>Home</span>
                        </label>
                        <label className="address-type-label">
                          <input
                            type="radio"
                            name="addressType"
                            value="Work"
                            checked={addressForm.type === "Work"}
                            onChange={() => setAddressForm({ ...addressForm, type: "Work" })}
                          />
                          <span>Work</span>
                        </label>
                      </div>
                    </div>

                    {/* Buttons: SAVE & CANCEL */}
                    <div className="address-form-actions">
                      <button type="submit" className="address-btn-save">
                        SAVE
                      </button>
                      <button
                        type="button"
                        className="address-btn-cancel"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saved Addresses List */}
              <div className="saved-addresses-list">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className={`saved-address-card ${addr.isDefault ? "is-default" : ""}`}>
                    <div className="saved-address-top">
                      <div className="saved-address-badges">
                        <span className="saved-address-type-pill">{addr.type}</span>
                        {addr.isDefault && <span className="default-pill">DEFAULT</span>}
                      </div>

                      <div className="saved-address-actions">
                        <button
                          type="button"
                          className="address-action-btn"
                          title="Edit"
                          onClick={() => handleEditAddress(addr)}
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          type="button"
                          className="address-action-btn delete"
                          title="Delete"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="saved-address-info">
                      <div className="saved-address-name-row">
                        <strong>{addr.name}</strong>
                        <span>{addr.phone}</span>
                      </div>
                      <p className="saved-address-lines">
                        {addr.street}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      {addr.landmark && (
                        <p className="saved-address-landmark">
                          <strong>Landmark:</strong> {addr.landmark}
                        </p>
                      )}
                    </div>

                    {!addr.isDefault && (
                      <button
                        type="button"
                        className="set-default-btn"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                      >
                        Set as Default Delivery Address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATION */}
          {activeTab === "verification" && (
            <div className="profile-content-card">
              <h3 className="profile-section-title">Identity & Verification</h3>
              <div className="profile-verification-banner">
                <ShieldCheck size={36} className="profile-verification-icon" />
                <div>
                  <h4>Verified Rental Member</h4>
                  <p>Verified accounts enjoy instant booking approvals and zero deposit waiver.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DEACTIVATE CONFIRMATION MODAL */}
      {showDeactivateModal && (
        <div className="profile-modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Deactivate Account?</h3>
              <button onClick={() => setShowDeactivateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="profile-modal-body">
              Are you sure you want to deactivate your MineForNow account? Your active listings will
              be paused and you will be signed out.
            </p>
            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-btn cancel"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-modal-btn confirm"
                onClick={handleDeactivate}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;