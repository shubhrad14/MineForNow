import { useState, useEffect } from "react";
import {
  Star,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ShieldCheck,
  Award,
  CheckCircle2,
  Trash2,
  Menu,
  MessageSquare,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminReviews.css";

function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("All");

  const [reviews, setReviews] = useState([
    {
      id: "REV_01",
      customerName: "Aditya Sharma",
      customerEmail: "aditya@example.com",
      itemName: "Sony Alpha A7 Camera",
      ownerName: "Sameer V.",
      overallScore: 5.0,
      care: 5,
      punctuality: 5,
      communication: 5,
      badge: "Super Renter",
      tags: ["Returned Spotless", "On-Time Handover", "Highly Recommended"],
      comment: "Exceptional borrower! Returned the gear in immaculate condition and on time. Would gladly rent again.",
      date: "22 Oct 2026",
      status: "Verified",
    },
    {
      id: "REV_02",
      customerName: "Priya Nair",
      customerEmail: "priya@example.com",
      itemName: "Full HD Portable Projector",
      ownerName: "Priya Mehta",
      overallScore: 4.8,
      care: 5,
      punctuality: 4,
      communication: 5,
      badge: "Super Renter",
      tags: ["Great Communication", "Careful Handling"],
      comment: "Smooth coordination. Handled the projector with care and returned all cords intact.",
      date: "21 Oct 2026",
      status: "Verified",
    },
    {
      id: "REV_03",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram@example.com",
      itemName: "Desert Air Cooler 50L",
      ownerName: "Sneha Rao",
      overallScore: 4.3,
      care: 4,
      punctuality: 5,
      communication: 4,
      badge: "Reliable Borrower",
      tags: ["On-Time Handover"],
      comment: "Very punctual return and pleasant communication throughout the rental window.",
      date: "19 Oct 2026",
      status: "Verified",
    },
  ]);

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const storedTrust = JSON.parse(
        localStorage.getItem("mineForNowCustomerTrustScores") || "{}"
      );
      const dynamicList = [];

      Object.entries(storedTrust).forEach(([key, val], idx) => {
        if (val.reviews && Array.isArray(val.reviews)) {
          val.reviews.forEach((r, rIdx) => {
            dynamicList.push({
              id: `REV_LIVE_${idx}_${rIdx}`,
              customerName: key.charAt(0).toUpperCase() + key.slice(1),
              customerEmail: `${key}@example.com`,
              itemName: r.itemName || "Marketplace Equipment",
              ownerName: r.ownerName || "Item Owner",
              overallScore: Number(r.overall || val.score || 5.0),
              care: r.care || 5,
              punctuality: r.punctuality || 5,
              communication: r.communication || 5,
              badge: val.badge || "Verified Borrower",
              tags: r.tags || ["Returned Spotless"],
              comment: r.comment || "Great borrower, returned gear safely.",
              date: "Recently Awarded",
              status: "Verified",
            });
          });
        }
      });

      if (dynamicList.length > 0) {
        setReviews((prev) => {
          const names = new Set(dynamicList.map((d) => d.customerName));
          return [...dynamicList, ...prev.filter((p) => !names.has(p.customerName))];
        });
      }
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const handleRemoveReview = (id) => {
    const confirm = window.confirm("Are you sure you want to remove this community review as inappropriate?");
    if (!confirm) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === "All" ||
      (filterRating === "5" && r.overallScore >= 4.8) ||
      (filterRating === "4" && r.overallScore >= 4.0 && r.overallScore < 4.8) ||
      (filterRating === "critical" && r.overallScore < 4.0);

    return matchesSearch && matchesRating;
  });

  const avgTrust = (
    reviews.reduce((acc, r) => acc + r.overallScore, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div
      className={`admin-reviews-page ${
        sidebarOpen ? "sidebar-is-open" : ""
      }`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-reviews-content">
        {/* HEADER */}
        <div className="admin-reviews-header">
          <div className="admin-header-title-group">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="admin-reviews-eyebrow">REPUTATION & QUALITY AUDIT</p>
              <h1>Trust Scores & Reviews</h1>
              <span>Oversight of owner feedback, gear care ratings, and verified community reputations.</span>
            </div>
          </div>

          <div className="admin-reviews-quick-stat">
            <ShieldCheck size={20} color="#2e6930" />
            <div>
              <strong>{avgTrust} ★</strong>
              <span>Avg Platform Trust Score</span>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="admin-reviews-metrics">
          <div className="review-metric-box">
            <span>Community Standing</span>
            <strong style={{ color: "#2e6930" }}>{avgTrust} / 5.0 ★</strong>
            <small>High overall borrower care</small>
          </div>
          <div className="review-metric-box">
            <span>Verified Feedback Records</span>
            <strong>{reviews.length}</strong>
            <small>Evaluated upon equipment return</small>
          </div>
          <div className="review-metric-box">
            <span>Super Renter Badges</span>
            <strong style={{ color: "#b15d45" }}>
              {reviews.filter((r) => r.overallScore >= 4.8).length}
            </strong>
            <small>Eligible for zero-deposit priority</small>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="admin-reviews-toolbar">
          <div className="admin-reviews-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search by customer, owner, or rented item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-reviews-filter">
            <SlidersHorizontal size={16} />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="5">5.0★ (Super Renters)</option>
              <option value="4">4.0★ - 4.7★ (Reliable)</option>
              <option value="critical">Under 4.0★</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="admin-reviews-grid">
          {filteredReviews.length === 0 ? (
            <div className="admin-reviews-empty">
              No feedback records found matching your search.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div className="admin-review-card" key={rev.id}>
                <div className="review-card-header">
                  <div>
                    <div className="review-target-renter">
                      <strong>{rev.customerName}</strong>
                      <span className="badge-tag">
                        <Award size={13} />
                        {rev.badge}
                      </span>
                    </div>
                    <span className="review-item-name">
                      Item: <em>{rev.itemName}</em> • Reviewed by <strong>{rev.ownerName}</strong>
                    </span>
                  </div>

                  <div className="review-score-pill">
                    <ShieldCheck size={14} />
                    <span>{rev.overallScore} ★</span>
                  </div>
                </div>

                {/* 3 PILLARS MINI ROW */}
                <div className="review-pillars-mini">
                  <span>Care: <strong>{rev.care}★</strong></span>
                  <span>Punctuality: <strong>{rev.punctuality}★</strong></span>
                  <span>Communication: <strong>{rev.communication}★</strong></span>
                </div>

                {/* PRAISE TAGS */}
                {rev.tags && rev.tags.length > 0 && (
                  <div className="review-tags-mini">
                    {rev.tags.map((t) => (
                      <span key={t} className="tag-pill">✓ {t}</span>
                    ))}
                  </div>
                )}

                {/* COMMENT */}
                {rev.comment && (
                  <p className="review-quote-body">
                    "{rev.comment}"
                  </p>
                )}

                <div className="review-card-footer">
                  <span className="review-date-note">{rev.date}</span>
                  <button
                    type="button"
                    className="btn-del-review"
                    onClick={() => handleRemoveReview(rev.id)}
                    title="Remove inappropriate feedback"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminReviews;
