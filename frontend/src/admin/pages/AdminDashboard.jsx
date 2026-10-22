import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  CalendarDays,
  IndianRupee,
  Bell,
  ChevronRight,
  ChevronDown,
  Star,
  AlertTriangle,
  UserCheck,
  Menu,
  ArrowUpRight,
  Calendar,
  Camera,
  Snowflake,
  HeartPulse,
  Clapperboard,
  Tent,
  Settings,
  BarChart3,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Shield,
  CheckCircle2,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const [stats, setStats] = useState({
    users: 248,
    listings: 126,
    bookings: 84,
    revenue: 42680,
    trustScore: 4.9,
  });

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Handle outside click for admin profile dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const storedListings = JSON.parse(
        localStorage.getItem("mineForNowListings") || "[]"
      );
      const storedRequests = JSON.parse(
        localStorage.getItem("mineForNowRentalRequests") || "[]"
      );
      const storedTrust = JSON.parse(
        localStorage.getItem("mineForNowCustomerTrustScores") || "{}"
      );

      const dynamicListings =
        storedListings.length > 0 ? storedListings.length + 120 : 126;
      const dynamicBookings =
        storedRequests.length > 0 ? storedRequests.length + 80 : 84;
      const calcRevenue = storedRequests.reduce(
        (acc, r) => acc + (Number(r.total) || 0),
        0
      );
      const dynamicRevenue = calcRevenue > 0 ? calcRevenue + 42000 : 42680;

      const trustValues = Object.values(storedTrust)
        .map((t) => t.score)
        .filter(Boolean);
      const avgTrust =
        trustValues.length > 0
          ? Number(
              (
                trustValues.reduce((a, b) => a + b, 0) / trustValues.length
              ).toFixed(1)
            )
          : 4.9;

      setStats({
        users: 248 + (storedRequests.length > 0 ? 1 : 0),
        listings: dynamicListings,
        bookings: dynamicBookings,
        revenue: dynamicRevenue,
        trustScore: avgTrust,
      });
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  return (
    <div
      className={`admin-dashboard-page ${
        sidebarOpen ? "sidebar-is-open" : ""
      }`}
    >
      {/* =========================
          SIDEBAR
      ========================= */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="admin-dashboard-content">
        {/* =========================
            HEADER
        ========================= */}
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <button
              className="admin-menu-button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Open admin menu"
            >
              <Menu size={25} />
            </button>

            <div className="admin-header-title">
              <p>ADMIN PANEL</p>
              <h1>Dashboard</h1>
              <span>
                Welcome back. Here's what's happening on MineForNow today.
              </span>
            </div>
          </div>

          <div className="admin-header-right">
            <div className="admin-date">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>

            {/* WORKING ADMIN PROFILE DROPDOWN */}
            <div className="admin-profile-wrapper" ref={profileDropdownRef}>
              <button
                type="button"
                className={`admin-profile ${
                  profileDropdownOpen ? "is-active" : ""
                }`}
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="admin-profile-avatar">A</div>

                <div className="admin-profile-meta">
                  <strong>Admin</strong>
                  <span>Administrator</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`admin-profile-chevron ${
                    profileDropdownOpen ? "chevron-open" : ""
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="admin-profile-menu">
                  <div className="admin-profile-menu-header">
                    <div className="menu-header-avatar">A</div>
                    <div className="menu-header-info">
                      <div className="menu-header-badge">
                        <ShieldCheck size={12} />
                        <span>Super Administrator</span>
                      </div>
                      <p className="menu-header-name">Platform Admin</p>
                      <span className="menu-header-email">
                        admin@minefornow.com
                      </span>
                    </div>
                  </div>

                  <div className="admin-profile-menu-divider" />

                  <div className="admin-profile-menu-links">
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/admin/settings");
                      }}
                    >
                      <Settings size={16} />
                      <div className="menu-item-text">
                        <span>Platform Settings</span>
                        <small>Fees, deposits & trust thresholds</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/admin/reports");
                      }}
                    >
                      <BarChart3 size={16} />
                      <div className="menu-item-text">
                        <span>Financial Reports</span>
                        <small>Revenue & platform analytics</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/admin/users");
                      }}
                    >
                      <Users size={16} />
                      <div className="menu-item-text">
                        <span>User Management</span>
                        <small>Review renters & equipment owners</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/");
                      }}
                    >
                      <ExternalLink size={16} />
                      <div className="menu-item-text">
                        <span>View Public Site</span>
                        <small>Browse items as visitor</small>
                      </div>
                    </button>
                  </div>

                  <div className="admin-profile-menu-divider" />

                  <button
                    type="button"
                    className="profile-menu-item profile-menu-logout"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      localStorage.removeItem("mineForNowAdmin");
                      navigate("/admin/login");
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =========================
            PLATFORM OVERVIEW
        ========================= */}
        <section className="platform-overview">
          <div className="section-heading">
            <span>PLATFORM OVERVIEW</span>
          </div>

          <div className="overview-row">
            {/* USERS */}
            <div
              className="overview-item cursor-pointer"
              onClick={() => navigate("/admin/users")}
              title="Click to view users"
            >
              <div className="overview-icon overview-icon-users">
                <Users size={21} />
              </div>

              <div className="overview-info">
                <span>Total Users</span>
                <strong>{stats.users}</strong>
                <small>
                  <ArrowUpRight size={13} />
                  12% this week
                </small>
              </div>
            </div>

            {/* LISTINGS */}
            <div
              className="overview-item cursor-pointer"
              onClick={() => navigate("/admin/listings")}
              title="Click to view listings"
            >
              <div className="overview-icon overview-icon-listings">
                <Package size={21} />
              </div>

              <div className="overview-info">
                <span>Total Listings</span>
                <strong>{stats.listings}</strong>
                <small>
                  <ArrowUpRight size={13} />
                  8% this week
                </small>
              </div>
            </div>

            {/* BOOKINGS */}
            <div
              className="overview-item cursor-pointer"
              onClick={() => navigate("/admin/bookings")}
              title="Click to view bookings"
            >
              <div className="overview-icon overview-icon-bookings">
                <CalendarDays size={21} />
              </div>

              <div className="overview-info">
                <span>Total Bookings</span>
                <strong>{stats.bookings}</strong>
                <small>
                  <ArrowUpRight size={13} />
                  14% this week
                </small>
              </div>
            </div>

            {/* REVENUE */}
            <div
              className="overview-item cursor-pointer"
              onClick={() => navigate("/admin/reports")}
              title="Click to view financial reports"
            >
              <div className="overview-icon overview-icon-revenue">
                <IndianRupee size={21} />
              </div>

              <div className="overview-info">
                <span>Total Revenue</span>
                <strong>₹{stats.revenue.toLocaleString("en-IN")}</strong>
                <small>
                  <ArrowUpRight size={13} />
                  9.4% this week
                </small>
              </div>
            </div>

            {/* COMMUNITY TRUST */}
            <div
              className="overview-item cursor-pointer"
              onClick={() => navigate("/admin/reviews")}
              title="Click to view trust & reviews"
            >
              <div className="overview-icon overview-icon-trust">
                <Star size={21} />
              </div>

              <div className="overview-info">
                <span>Avg Trust Score</span>
                <strong>{stats.trustScore} / 5.0</strong>
                <small className="trust-badge-pill">
                  Airbnb-style Trust
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            MIDDLE SECTION
        ========================= */}
        <section className="admin-middle-grid">
          {/* =========================
              BOOKING ACTIVITY
          ========================= */}
          <div className="dashboard-panel booking-panel">
            <div className="panel-header">
              <div>
                <p>BOOKING ACTIVITY</p>
                <h2>Rental activity</h2>
              </div>

              <button className="period-button">
                Last 7 days
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="chart-area">
              <div className="chart-y-labels">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>

              <div className="chart">
                <div className="chart-grid-line line-1"></div>
                <div className="chart-grid-line line-2"></div>
                <div className="chart-grid-line line-3"></div>
                <div className="chart-grid-line line-4"></div>
                <div className="chart-grid-line line-5"></div>

                <svg
                  className="booking-chart-svg"
                  viewBox="0 0 700 250"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="chartFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgba(177, 93, 69, 0.20)"
                      />
                      <stop
                        offset="100%"
                        stopColor="rgba(177, 93, 69, 0)"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M 0 190
                      C 70 175, 70 145, 116 155
                      C 170 168, 190 135, 230 130
                      C 275 125, 285 175, 340 165
                      C 395 155, 390 130, 455 128
                      C 515 126, 500 145, 570 130
                      C 620 120, 650 100, 700 72
                      L 700 250
                      L 0 250
                      Z
                    "
                    fill="url(#chartFill)"
                  />

                  <path
                    d="
                      M 0 190
                      C 70 175, 70 145, 116 155
                      C 170 168, 190 135, 230 130
                      C 275 125, 285 175, 340 165
                      C 395 155, 390 130, 455 128
                      C 515 126, 500 145, 570 130
                      C 620 120, 650 100, 700 72
                    "
                    fill="none"
                    stroke="var(--action-primary)"
                    strokeWidth="3"
                  />

                  <circle cx="0" cy="190" r="5" fill="var(--action-primary)" />
                  <circle cx="116" cy="155" r="5" fill="var(--action-primary)" />
                  <circle cx="230" cy="130" r="5" fill="var(--action-primary)" />
                  <circle cx="340" cy="165" r="5" fill="var(--action-primary)" />
                  <circle cx="455" cy="128" r="5" fill="var(--action-primary)" />
                  <circle cx="570" cy="130" r="5" fill="var(--action-primary)" />
                  <circle cx="700" cy="72" r="5" fill="var(--action-primary)" />
                </svg>

                <div className="chart-days">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              NEEDS ATTENTION
          ========================= */}
          <div className="dashboard-panel attention-panel">
            <div className="panel-header attention-header">
              <div className="attention-title">
                <div className="attention-icon">
                  <Bell size={17} />
                </div>
                <p>NEEDS YOUR ATTENTION</p>
              </div>
            </div>

            <div className="attention-list">
              <button
                className="attention-item"
                onClick={() => navigate("/admin/listings")}
              >
                <div className="attention-item-icon">
                  <Package size={17} />
                </div>
                <strong>7</strong>
                <span>Listings waiting for approval</span>
                <ChevronRight size={17} />
              </button>

              <button
                className="attention-item"
                onClick={() => navigate("/admin/reviews")}
              >
                <div className="attention-item-icon">
                  <Star size={17} />
                </div>
                <strong>4</strong>
                <span>Reviews to moderate</span>
                <ChevronRight size={17} />
              </button>

              <button
                className="attention-item"
                onClick={() => navigate("/admin/bookings")}
              >
                <div className="attention-item-icon">
                  <AlertTriangle size={17} />
                </div>
                <strong>2</strong>
                <span>Booking disputes</span>
                <ChevronRight size={17} />
              </button>

              <button
                className="attention-item"
                onClick={() => navigate("/admin/users")}
              >
                <div className="attention-item-icon">
                  <UserCheck size={17} />
                </div>
                <strong>2</strong>
                <span>Verification requests</span>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            BOTTOM GRID
        ========================= */}
        <section className="admin-bottom-grid">
          {/* =========================
              RECENT BOOKINGS
          ========================= */}
          <div className="dashboard-panel recent-bookings">
            <div className="panel-header">
              <div className="panel-title-with-icon">
                <div className="small-panel-icon">
                  <CalendarDays size={17} />
                </div>
                <p>RECENT BOOKINGS</p>
              </div>

              <button
                className="view-all-button"
                onClick={() => navigate("/admin/bookings")}
              >
                View all
              </button>
            </div>

            <div className="booking-table">
              <div className="table-row table-heading">
                <span>ID</span>
                <span>Item</span>
                <span>Borrower</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              <div className="table-row">
                <span>#BK1024</span>
                <span>Canon Camera</span>
                <span>Rahul</span>
                <span>15 Sep</span>
                <span>
                  <em className="status active">Active</em>
                </span>
              </div>

              <div className="table-row">
                <span>#BK1023</span>
                <span>Projector</span>
                <span>Priya</span>
                <span>14 Sep</span>
                <span>
                  <em className="status pending">Pending</em>
                </span>
              </div>

              <div className="table-row">
                <span>#BK1022</span>
                <span>Wheelchair</span>
                <span>Amit</span>
                <span>13 Sep</span>
                <span>
                  <em className="status completed">Completed</em>
                </span>
              </div>

              <div className="table-row">
                <span>#BK1021</span>
                <span>Air Cooler</span>
                <span>Sneha</span>
                <span>12 Sep</span>
                <span>
                  <em className="status active">Active</em>
                </span>
              </div>

              <div className="table-row">
                <span>#BK1020</span>
                <span>Laptop</span>
                <span>Karan</span>
                <span>11 Sep</span>
                <span>
                  <em className="status completed">Completed</em>
                </span>
              </div>
            </div>

            <button
              className="bottom-link"
              onClick={() => navigate("/admin/bookings")}
            >
              View all bookings
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* =========================
              RECENT LISTINGS (LUCIDE ICONS, NO EMOJIS)
          ========================= */}
          <div className="dashboard-panel recent-listings">
            <div className="panel-header">
              <div className="panel-title-with-icon">
                <div className="small-panel-icon">
                  <Package size={17} />
                </div>
                <p>RECENT LISTINGS</p>
              </div>

              <button
                className="view-all-button"
                onClick={() => navigate("/admin/listings")}
              >
                View all
              </button>
            </div>

            <div className="listing-list">
              <div className="listing-row">
                <div className="listing-image listing-vector-icon">
                  <Camera size={19} />
                </div>

                <div className="listing-info">
                  <strong>Canon Camera</strong>
                  <span>Electronics</span>
                </div>

                <strong className="listing-price">₹800/day</strong>

                <em className="status active">Active</em>
              </div>

              <div className="listing-row">
                <div className="listing-image listing-vector-icon">
                  <Snowflake size={19} />
                </div>

                <div className="listing-info">
                  <strong>Air Cooler</strong>
                  <span>Home Appliances</span>
                </div>

                <strong className="listing-price">₹450/day</strong>

                <em className="status active">Active</em>
              </div>

              <div className="listing-row">
                <div className="listing-image listing-vector-icon">
                  <HeartPulse size={19} />
                </div>

                <div className="listing-info">
                  <strong>Wheelchair</strong>
                  <span>Medical</span>
                </div>

                <strong className="listing-price">₹400/day</strong>

                <em className="status pending">Pending</em>
              </div>

              <div className="listing-row">
                <div className="listing-image listing-vector-icon">
                  <Clapperboard size={19} />
                </div>

                <div className="listing-info">
                  <strong>Projector</strong>
                  <span>Electronics</span>
                </div>

                <strong className="listing-price">₹600/day</strong>

                <em className="status active">Active</em>
              </div>

              <div className="listing-row">
                <div className="listing-image listing-vector-icon">
                  <Tent size={19} />
                </div>

                <div className="listing-info">
                  <strong>Camping Tent</strong>
                  <span>Outdoor</span>
                </div>

                <strong className="listing-price">₹300/day</strong>

                <em className="status active">Active</em>
              </div>
            </div>

            <button
              className="bottom-link"
              onClick={() => navigate("/admin/listings")}
            >
              View all listings
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* =========================
              RECENT REVIEWS
          ========================= */}
          <div className="dashboard-panel recent-reviews">
            <div className="panel-header">
              <div className="panel-title-with-icon">
                <div className="small-panel-icon">
                  <Star size={17} />
                </div>
                <p>RECENT REVIEWS</p>
              </div>

              <button
                className="view-all-button"
                onClick={() => navigate("/admin/reviews")}
              >
                View all
              </button>
            </div>

            <div className="review-list">
              <div className="review-item">
                <div className="review-avatar">RS</div>
                <div className="review-content">
                  <div className="review-top">
                    <strong>Rahul S.</strong>
                    <span>2 hours ago</span>
                  </div>
                  <div className="review-stars">★★★★★</div>
                  <p>
                    Great experience! The camera was in excellent condition.
                  </p>
                </div>
              </div>

              <div className="review-item">
                <div className="review-avatar">PM</div>
                <div className="review-content">
                  <div className="review-top">
                    <strong>Priya M.</strong>
                    <span>4 hours ago</span>
                  </div>
                  <div className="review-stars">★★★★☆</div>
                  <p>Item was good, but delivery was slightly late.</p>
                </div>
              </div>

              <div className="review-item">
                <div className="review-avatar">AK</div>
                <div className="review-content">
                  <div className="review-top">
                    <strong>Amit K.</strong>
                    <span>6 hours ago</span>
                  </div>
                  <div className="review-stars">★★★★★</div>
                  <p>Very helpful owner. Smooth booking process.</p>
                </div>
              </div>

              <div className="review-item">
                <div className="review-avatar">SR</div>
                <div className="review-content">
                  <div className="review-top">
                    <strong>Sneha R.</strong>
                    <span>1 day ago</span>
                  </div>
                  <div className="review-stars">★★★★★</div>
                  <p>Highly recommended!</p>
                </div>
              </div>
            </div>

            <button
              className="bottom-link"
              onClick={() => navigate("/admin/reviews")}
            >
              View all reviews
              <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
