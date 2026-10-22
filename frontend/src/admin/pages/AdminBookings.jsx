import { useState, useEffect } from "react";
import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  CheckCircle2,
  XCircle,
  Menu,
  ShieldCheck,
  IndianRupee,
  Clock3,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminBookings.css";

function AdminBookings() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([
    {
      id: "BKG_101",
      itemName: "Sony Alpha A7 Camera",
      category: "Electronics",
      renterName: "Aditya Sharma",
      renterEmail: "aditya@example.com",
      renterTrust: "5.0",
      ownerName: "Rahul Sharma",
      dates: "24 Oct 2026 - 29 Oct 2026",
      total: 4750,
      status: "Completed",
      paymentStatus: "Paid",
      createdAt: "22 Oct 2026",
    },
    {
      id: "BKG_102",
      itemName: "Full HD Portable Projector",
      category: "Electronics",
      renterName: "Priya Nair",
      renterEmail: "priya@example.com",
      renterTrust: "4.8",
      ownerName: "Priya Mehta",
      dates: "26 Oct 2026 - 28 Oct 2026",
      total: 1800,
      status: "Approved",
      paymentStatus: "Paid",
      createdAt: "21 Oct 2026",
    },
    {
      id: "BKG_103",
      itemName: "Desert Air Cooler 50L",
      category: "Home Appliances",
      renterName: "Vikram Malhotra",
      renterEmail: "vikram@example.com",
      renterTrust: "4.9",
      ownerName: "Sneha Rao",
      dates: "25 Oct 2026 - 30 Oct 2026",
      total: 2250,
      status: "Approved",
      paymentStatus: "Pending",
      createdAt: "20 Oct 2026",
    },
    {
      id: "BKG_104",
      itemName: "Foldable Wheelchair",
      category: "Medical Equipment",
      renterName: "Sunita Deshmukh",
      renterEmail: "sunita@example.com",
      renterTrust: "5.0",
      ownerName: "Amit Kumar",
      dates: "15 Oct 2026 - 20 Oct 2026",
      total: 2000,
      status: "Completed",
      paymentStatus: "Paid",
      createdAt: "14 Oct 2026",
    },
  ]);

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const stored = JSON.parse(
        localStorage.getItem("mineForNowRentalRequests") || "[]"
      );
      if (stored.length > 0) {
        const formatted = stored.map((r, idx) => ({
          id: r.id ? `BKG_${r.id.toString().slice(-4)}` : `BKG_20${idx}`,
          itemName: r.itemName || "Rental Item",
          category: r.category || "General",
          renterName: r.renterName || "Customer",
          renterEmail: r.renterEmail || "customer@example.com",
          renterTrust: r.trustScore?.overall || "4.9",
          ownerName: r.ownerName || "Item Owner",
          dates: r.dates || "Active Period",
          total: Number(r.total || 1500),
          status: r.status || "Approved",
          paymentStatus: r.status === "Completed" || r.status === "Confirmed" ? "Paid" : "Pending",
          createdAt: "Recent",
          image: r.image,
        }));

        setBookings((prev) => {
          const ids = new Set(formatted.map((f) => f.id));
          return [...formatted, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.renterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const activeCount = bookings.filter((b) => b.status === "Approved" || b.status === "Confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;

  return (
    <div
      className={`admin-bookings-page ${
        sidebarOpen ? "sidebar-is-open" : ""
      }`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-bookings-content">
        {/* HEADER */}
        <div className="admin-bookings-header">
          <div className="admin-header-title-group">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="admin-bookings-eyebrow">TRANSACTION OVERSIGHT</p>
              <h1>Rental Bookings</h1>
              <span>Monitor, audit and resolve all equipment rental transactions across MineForNow.</span>
            </div>
          </div>

          <div className="admin-bookings-quick-stat">
            <CalendarDays size={18} />
            <div>
              <strong>{bookings.length}</strong>
              <span>Total Transactions</span>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="admin-bookings-metrics">
          <div className="booking-metric-card">
            <span>Total Volume</span>
            <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
            <small>Across all platform orders</small>
          </div>
          <div className="booking-metric-card">
            <span>Active / In Progress</span>
            <strong style={{ color: "#2e6930" }}>{activeCount}</strong>
            <small>Equipment currently with borrowers</small>
          </div>
          <div className="booking-metric-card">
            <span>Completed & Returned</span>
            <strong style={{ color: "#b15d45" }}>{completedCount}</strong>
            <small>Successfully returned to owners</small>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="admin-bookings-toolbar">
          <div className="admin-bookings-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search by item, renter, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-bookings-filter">
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="admin-bookings-table-card">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Rented Equipment</th>
                <th>Borrower</th>
                <th>Rental Dates</th>
                <th>Total Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-empty-table">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <code className="booking-id-tag">{b.id}</code>
                    </td>
                    <td>
                      <div className="booking-item-cell">
                        <strong>{b.itemName}</strong>
                        <span>{b.category}</span>
                      </div>
                    </td>
                    <td>
                      <div className="booking-renter-cell">
                        <strong>{b.renterName}</strong>
                        <span className="booking-trust-pill">
                          <ShieldCheck size={12} />
                          {b.renterTrust}★
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="booking-dates-cell">
                        <Clock3 size={13} />
                        <span>{b.dates}</span>
                      </div>
                    </td>
                    <td>
                      <strong>₹{Number(b.total || 0).toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <span className={`booking-status-tag ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view-booking"
                        onClick={() => setSelectedBooking(b)}
                        title="View details & manage"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOOKING DETAILS MODAL */}
        {selectedBooking && (
          <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
            <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <span className="modal-eyebrow">BOOKING DETAILS</span>
                  <h3>{selectedBooking.id}</h3>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedBooking(null)}
                >
                  ✕
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="modal-info-row">
                  <span>Equipment:</span>
                  <strong>{selectedBooking.itemName} ({selectedBooking.category})</strong>
                </div>
                <div className="modal-info-row">
                  <span>Borrower:</span>
                  <strong>{selectedBooking.renterName} ({selectedBooking.renterEmail})</strong>
                </div>
                <div className="modal-info-row">
                  <span>Renter Trust Rating:</span>
                  <strong>{selectedBooking.renterTrust} ★ (Verified Borrower)</strong>
                </div>
                <div className="modal-info-row">
                  <span>Rental Period:</span>
                  <strong>{selectedBooking.dates}</strong>
                </div>
                <div className="modal-info-row">
                  <span>Total Rental Fee:</span>
                  <strong>₹{Number(selectedBooking.total).toLocaleString("en-IN")}</strong>
                </div>
                <div className="modal-info-row">
                  <span>Current Status:</span>
                  <span className={`booking-status-tag ${selectedBooking.status.toLowerCase()}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="modal-action-btns">
                  {selectedBooking.status !== "Completed" && (
                    <button
                      type="button"
                      className="btn-modal-complete"
                      onClick={() => handleUpdateStatus(selectedBooking.id, "Completed")}
                    >
                      <CheckCircle2 size={15} />
                      Admin Force Complete
                    </button>
                  )}
                  {selectedBooking.status !== "Cancelled" && (
                    <button
                      type="button"
                      className="btn-modal-cancel"
                      onClick={() => handleUpdateStatus(selectedBooking.id, "Cancelled")}
                    >
                      <XCircle size={15} />
                      Cancel & Refund Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminBookings;
