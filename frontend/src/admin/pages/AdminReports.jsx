import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  IndianRupee,
  Calendar,
  Download,
  TrendingUp,
  Package,
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Layers,
  Menu,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminReports.css";

function AdminReports() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const [timeRange, setTimeRange] = useState("30days");
  const [toastMessage, setToastMessage] = useState("");

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Category revenue statistics
  const categoryStats = [
    { name: "Electronics & Tech", percentage: 38, amount: 146110, count: 52 },
    { name: "Photography & Film", percentage: 26, amount: 99970, count: 36 },
    { name: "Camping & Outdoor", percentage: 18, amount: 69210, count: 28 },
    { name: "Home Appliances", percentage: 11, amount: 42295, count: 19 },
    { name: "Medical & Mobility", percentage: 7, amount: 26915, count: 11 },
  ];

  // Top rented equipment
  const topListings = [
    {
      id: "EQ-101",
      name: "Sony Alpha A7 IV Camera",
      category: "Photography & Film",
      rentals: 28,
      revenue: 56000,
      owner: "Rahul Sharma",
      rating: 4.9,
    },
    {
      id: "EQ-104",
      name: "DJI Mavic Air 2 Drone",
      category: "Electronics & Tech",
      rentals: 22,
      revenue: 48400,
      owner: "Pooja Verma",
      rating: 5.0,
    },
    {
      id: "EQ-102",
      name: "Full HD 4K Portable Projector",
      category: "Electronics & Tech",
      rentals: 19,
      revenue: 17100,
      owner: "Priya Mehta",
      rating: 4.8,
    },
    {
      id: "EQ-105",
      name: "Quechua 4-Person Waterproof Tent",
      category: "Camping & Outdoor",
      rentals: 17,
      revenue: 13600,
      owner: "Vikram Malhotra",
      rating: 4.9,
    },
    {
      id: "EQ-103",
      name: "Symphony Desert Air Cooler 70L",
      category: "Home Appliances",
      rentals: 14,
      revenue: 10500,
      owner: "Sneha Rao",
      rating: 4.7,
    },
  ];

  // Monthly revenue trajectory
  const monthlyTrajectory = [
    { month: "May", gmv: 184000, revenue: 18400, bookings: 88 },
    { month: "Jun", gmv: 215000, revenue: 21500, bookings: 104 },
    { month: "Jul", gmv: 268000, revenue: 26800, bookings: 132 },
    { month: "Aug", gmv: 312000, revenue: 31200, bookings: 165 },
    { month: "Sep", gmv: 345000, revenue: 34500, bookings: 189 },
    { month: "Oct (MTD)", gmv: 384500, revenue: 38450, bookings: 218 },
  ];

  // Export CSV Report
  const handleExportCSV = () => {
    const csvRows = [
      ["MineForNow Financial & Platform Activity Report"],
      ["Generated On", new Date().toLocaleString("en-IN")],
      ["Timeframe", timeRange.toUpperCase()],
      [],
      ["METRICS SUMMARY"],
      ["Gross Merchandise Value (GMV)", "Rs. 3,84,500"],
      ["Platform Net Revenue (10% Fee)", "Rs. 38,450"],
      ["Total Completed Bookings", "218"],
      ["Average Rental Duration", "4.2 Days"],
      ["Average Customer Trust Score", "4.9 / 5.0"],
      [],
      ["REVENUE BY CATEGORY"],
      ["Category", "Share (%)", "Total Revenue (INR)", "Total Bookings"],
      ...categoryStats.map((c) => [c.name, `${c.percentage}%`, c.amount, c.count]),
      [],
      ["TOP PERFORMING EQUIPMENT"],
      ["Item ID", "Item Name", "Category", "Times Rented", "Revenue (INR)", "Owner", "Rating"],
      ...topListings.map((l) => [l.id, l.name, l.category, l.rentals, l.revenue, l.owner, l.rating]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `minefornow_financial_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Financial CSV report downloaded successfully!");
  };

  return (
    <div
      className={`admin-reports-page ${sidebarOpen ? "sidebar-is-open" : ""}`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-reports-content">
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="admin-reports-toast">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER */}
        <header className="admin-reports-header">
          <div className="admin-reports-header-left">
            <button
              className="admin-menu-button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Open admin menu"
            >
              <Menu size={24} />
            </button>

            <div className="admin-reports-title">
              <p>FINANCIAL & OPERATIONAL AUDIT</p>
              <h1>Reports & Analytics</h1>
              <span>
                Track platform gross merchandise value, commission earnings, category turnover, and community performance.
              </span>
            </div>
          </div>

          <div className="admin-reports-header-right">
            <div className="admin-reports-date">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>

            <button
              type="button"
              className="admin-export-btn"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* TIMEFRAME SELECTOR */}
        <div className="admin-reports-time-bar">
          <div className="time-selector-pills">
            <button
              className={`time-pill ${timeRange === "7days" ? "active" : ""}`}
              onClick={() => setTimeRange("7days")}
            >
              Last 7 Days
            </button>
            <button
              className={`time-pill ${timeRange === "30days" ? "active" : ""}`}
              onClick={() => setTimeRange("30days")}
            >
              Last 30 Days
            </button>
            <button
              className={`time-pill ${timeRange === "quarter" ? "active" : ""}`}
              onClick={() => setTimeRange("quarter")}
            >
              This Quarter
            </button>
            <button
              className={`time-pill ${timeRange === "ytd" ? "active" : ""}`}
              onClick={() => setTimeRange("ytd")}
            >
              Year to Date
            </button>
            <button
              className={`time-pill ${timeRange === "all" ? "active" : ""}`}
              onClick={() => setTimeRange("all")}
            >
              All Time
            </button>
          </div>

          <div className="time-filter-tag">
            <Filter size={14} />
            <span>Showing verified completed bookings only</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="reports-kpi-grid">
          <div className="reports-kpi-card">
            <div className="kpi-icon-wrap kpi-gmv">
              <IndianRupee size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Gross Transaction Volume (GMV)</span>
              <strong className="kpi-value">₹3,84,500</strong>
              <div className="kpi-growth positive">
                <TrendingUp size={13} />
                <span>+14.2% from previous month</span>
              </div>
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="kpi-icon-wrap kpi-commission">
              <BarChart3 size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Platform Commission (10%)</span>
              <strong className="kpi-value">₹38,450</strong>
              <div className="kpi-growth positive">
                <TrendingUp size={13} />
                <span>+12.8% net platform margin</span>
              </div>
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="kpi-icon-wrap kpi-bookings">
              <Package size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Completed Rentals</span>
              <strong className="kpi-value">218 Bookings</strong>
              <div className="kpi-growth positive">
                <TrendingUp size={13} />
                <span>98.4% on-time return rate</span>
              </div>
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="kpi-icon-wrap kpi-trust">
              <Star size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Average Community Trust</span>
              <strong className="kpi-value">4.9 / 5.0</strong>
              <div className="kpi-growth neutral">
                <ShieldCheck size={13} />
                <span>Zero disputed deposits</span>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION: MONTHLY TRAJECTORY & CATEGORY BREAKDOWN */}
        <section className="reports-middle-grid">
          {/* MONTHLY REVENUE GROWTH */}
          <div className="reports-panel trajectory-panel">
            <div className="reports-panel-header">
              <div>
                <p className="panel-eyebrow">GROWTH TREND</p>
                <h2>Monthly GMV & Platform Earnings</h2>
              </div>
              <span className="panel-badge">Fiscal Year 2026</span>
            </div>

            <div className="trajectory-bars">
              {monthlyTrajectory.map((item, idx) => {
                const maxGmv = 400000;
                const barHeightPct = Math.round((item.gmv / maxGmv) * 100);

                return (
                  <div key={idx} className="trajectory-col">
                    <div className="trajectory-bar-container">
                      <div
                        className="trajectory-bar-fill"
                        style={{ height: `${barHeightPct}%` }}
                      >
                        <span className="bar-tooltip">
                          ₹{item.gmv.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span className="trajectory-month">{item.month}</span>
                    <strong className="trajectory-revenue">
                      ₹{item.revenue.toLocaleString("en-IN")}
                    </strong>
                    <small className="trajectory-count">
                      {item.bookings} rentals
                    </small>
                  </div>
                );
              })}
            </div>

            <div className="trajectory-legend">
              <div className="legend-item">
                <span className="legend-box gmv-box"></span>
                <span>Gross Merchandise Value (GMV)</span>
              </div>
              <div className="legend-item">
                <span className="legend-box commission-box"></span>
                <span>Net Platform Fee Cut (10%)</span>
              </div>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div className="reports-panel category-panel">
            <div className="reports-panel-header">
              <div>
                <p className="panel-eyebrow">DIVERSIFICATION</p>
                <h2>Revenue by Category</h2>
              </div>
            </div>

            <div className="category-bars-list">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="category-stat-row">
                  <div className="cat-stat-head">
                    <span className="cat-name">{cat.name}</span>
                    <strong className="cat-amount">
                      ₹{cat.amount.toLocaleString("en-IN")}
                      <small>({cat.percentage}%)</small>
                    </strong>
                  </div>
                  <div className="cat-progress-track">
                    <div
                      className={`cat-progress-fill fill-${idx}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <div className="cat-stat-sub">
                    <span>{cat.count} total equipment rentals</span>
                    <span>Avg ₹{(cat.amount / cat.count).toFixed(0)} / order</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: TOP EQUIPMENT LEADERBOARD */}
        <section className="reports-panel leaderboard-panel">
          <div className="reports-panel-header">
            <div>
              <p className="panel-eyebrow">EQUIPMENT PERFORMANCE</p>
              <h2>Top Earning Rental Gear</h2>
            </div>
            <button
              className="view-listings-link"
              onClick={() => navigate("/admin/listings")}
            >
              <span>Manage All Listings</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="leaderboard-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Equipment Item</th>
                  <th>Category</th>
                  <th>Total Rentals</th>
                  <th>Gross Generated</th>
                  <th>Equipment Owner</th>
                  <th>Trust Rating</th>
                </tr>
              </thead>
              <tbody>
                {topListings.map((item, idx) => (
                  <tr key={item.id}>
                    <td>
                      <span className="rank-badge">#{idx + 1}</span>
                    </td>
                    <td>
                      <div className="item-title-cell">
                        <strong>{item.name}</strong>
                        <small>{item.id}</small>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{item.category}</span>
                    </td>
                    <td>
                      <strong>{item.rentals}</strong>
                    </td>
                    <td>
                      <strong className="cell-revenue">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td>
                      <span className="cell-owner">{item.owner}</span>
                    </td>
                    <td>
                      <span className="cell-trust">
                        <Star size={13} />
                        {item.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PLATFORM HEALTH METRICS */}
        <section className="platform-health-row">
          <div className="health-card">
            <div className="health-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>98.4% On-Time Returns</strong>
              <p>Borrowers consistently return gear before rental expiration</p>
            </div>
          </div>

          <div className="health-card">
            <div className="health-icon">
              <Clock size={20} />
            </div>
            <div>
              <strong>1.8 Hours Deposit Refund</strong>
              <p>Fast automated escrow release upon owner condition sign-off</p>
            </div>
          </div>

          <div className="health-card">
            <div className="health-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>100% Verified Users</strong>
              <p>Community trust scoring prevents rental disputes and damage</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminReports;
