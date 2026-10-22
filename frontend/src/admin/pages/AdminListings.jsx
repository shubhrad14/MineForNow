import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  Search,
  SlidersHorizontal,
  Package,
  MapPin,
  Eye,
  Check,
  X,
  Ban,
  ChevronDown,
  CalendarDays,
  Menu,
} from "lucide-react";

import "./AdminListings.css";

function AdminListings() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const stored = JSON.parse(
        localStorage.getItem("mineForNowListings") || "[]"
      );
      if (stored.length > 0) {
        const formatted = stored.map((item, idx) => ({
          id: item.id || `lst_${idx + 10}`,
          name: item.name,
          owner: item.ownerName || "Community Member",
          category: item.category || "General",
          location: item.location || "Mumbai",
          price: Number(item.price || item.pricePerDay || 450),
          status: item.availability === "available" ? "Active" : "Rented",
          date: "Recently Added",
          description:
            item.description ||
            "Verified rental listing active on MineForNow platform.",
          image: item.image,
        }));

        setListings((prev) => {
          const ids = new Set(formatted.map((f) => f.id));
          return [...formatted, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const [listings, setListings] = useState([
    {
      id: 1,
      name: "Canon Camera",
      owner: "Rahul Sharma",
      category: "Electronics",
      location: "Mumbai",
      price: 800,
      status: "Active",
      date: "15 Sep 2026",
      description:
        "Canon DSLR camera suitable for photography, events and personal use.",
    },
    {
      id: 2,
      name: "Projector",
      owner: "Priya Mehta",
      category: "Electronics",
      location: "Mumbai",
      price: 600,
      status: "Pending",
      date: "14 Sep 2026",
      description:
        "HD projector suitable for presentations, movie nights and events.",
    },
    {
      id: 3,
      name: "Wheelchair",
      owner: "Amit Kumar",
      category: "Medical Equipment",
      location: "Mumbai",
      price: 400,
      status: "Active",
      date: "13 Sep 2026",
      description:
        "Comfortable wheelchair available for short-term rental.",
    },
    {
      id: 4,
      name: "Air Cooler",
      owner: "Sneha Rao",
      category: "Home Appliances",
      location: "Mumbai",
      price: 450,
      status: "Active",
      date: "12 Sep 2026",
      description:
        "Portable air cooler available for home and office use.",
    },
    {
      id: 5,
      name: "Laptop",
      owner: "Karan Patel",
      category: "Electronics",
      location: "Mumbai",
      price: 700,
      status: "Suspended",
      date: "11 Sep 2026",
      description:
        "Laptop listed for short-term academic and professional use.",
    },
    {
      id: 6,
      name: "Microwave Oven",
      owner: "Neha Shah",
      category: "Home Appliances",
      location: "Mumbai",
      price: 350,
      status: "Pending",
      date: "10 Sep 2026",
      description:
        "Compact microwave oven suitable for temporary household use.",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setListings((currentListings) =>
      currentListings.map((listing) =>
        listing.id === id
          ? { ...listing, status: newStatus }
          : listing
      )
    );

    setSelectedListing(null);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.name.toLowerCase().includes(search.toLowerCase()) ||
      listing.owner.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      listing.category === category;

    const matchesStatus =
      status === "All Status" ||
      listing.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div
      className={`admin-listings-page ${
        sidebarOpen ? "sidebar-is-open" : ""
      }`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-listings-content">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="admin-listings-header">

          <div className="admin-header-title-group">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="admin-listings-eyebrow">
                PLATFORM MANAGEMENT
              </p>

              <h1>Listings</h1>

              <span>
                Review and manage items listed across all owners on MineForNow.
              </span>
            </div>
          </div>

        <div className="admin-listings-summary">
          <Package size={18} />

          <div>
            <strong>{listings.length}</strong>
            <span>Total Listings</span>
          </div>
        </div>

      </div>


      {/* =========================
          FILTER BAR
      ========================= */}

      <section className="admin-listings-toolbar">

        <div className="admin-listings-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search by item or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <div className="admin-listings-filter">

          <SlidersHorizontal size={16} />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Home Appliances</option>
            <option>Medical Equipment</option>
          </select>

          <ChevronDown size={14} />

        </div>


        <div className="admin-listings-filter">

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
            <option>Rejected</option>
          </select>

          <ChevronDown size={14} />

        </div>

      </section>


      {/* =========================
          LISTINGS TABLE
      ========================= */}

      <section className="admin-listings-panel">

        <div className="admin-listings-panel-header">

          <div>
            <p>ALL LISTINGS</p>

            <h2>
              {filteredListings.length}{" "}
              {filteredListings.length === 1
                ? "listing"
                : "listings"}
            </h2>
          </div>

          <span className="admin-listings-info">
            Supervision & moderation
          </span>

        </div>


        <div className="admin-listings-table">

          {/* TABLE HEADER */}

          <div className="admin-listing-row admin-listing-heading">

            <span>ITEM</span>
            <span>OWNER</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>STATUS</span>
            <span>ACTION</span>

          </div>


          {/* TABLE ROWS */}

          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (

              <div
                className="admin-listing-row"
                key={listing.id}
              >

                {/* ITEM */}

                <div className="admin-listing-item">

                  <div className="admin-listing-icon">
                    <Package size={18} />
                  </div>

                  <div>
                    <strong>{listing.name}</strong>

                    <span>
                      <MapPin size={11} />
                      {listing.location}
                    </span>
                  </div>

                </div>


                {/* OWNER */}

                <span className="admin-listing-owner">
                  {listing.owner}
                </span>


                {/* CATEGORY */}

                <span className="admin-listing-category">
                  {listing.category}
                </span>


                {/* PRICE */}

                <strong className="admin-listing-price">
                  ₹{listing.price}/day
                </strong>


                {/* STATUS */}

                <span
                  className={`admin-listing-status ${listing.status.toLowerCase()}`}
                >
                  <i></i>
                  {listing.status}
                </span>


                {/* ACTION */}

                <button
                  className="admin-listing-view"
                  onClick={() => setSelectedListing(listing)}
                >
                  <Eye size={15} />
                  View
                </button>

              </div>

            ))
          ) : (

            <div className="admin-listings-empty">

              <Package size={32} />

              <strong>No listings found</strong>

              <span>
                Try changing your search or filters.
              </span>

            </div>

          )}

        </div>

      </section>


      {/* =========================
          LISTING DETAILS MODAL
      ========================= */}

      {selectedListing && (

        <div
          className="admin-listing-overlay"
          onClick={() => setSelectedListing(null)}
        >

          <div
            className="admin-listing-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="admin-listing-modal-header">

              <div>

                <p>LISTING DETAILS</p>

                <h2>{selectedListing.name}</h2>

              </div>

              <button
                className="admin-listing-close"
                onClick={() => setSelectedListing(null)}
              >
                <X size={19} />
              </button>

            </div>


            <div className="admin-listing-modal-content">

              <div className="admin-modal-item-icon">
                <Package size={35} />
              </div>


              <div className="admin-modal-details">

                <div>
                  <span>Owner</span>
                  <strong>{selectedListing.owner}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{selectedListing.category}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{selectedListing.location}</strong>
                </div>

                <div>
                  <span>Rental Price</span>
                  <strong>₹{selectedListing.price}/day</strong>
                </div>

                <div>
                  <span>Listed On</span>
                  <strong>
                    <CalendarDays size={14} />
                    {selectedListing.date}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    <span
                      className={`admin-listing-status ${selectedListing.status.toLowerCase()}`}
                    >
                      <i></i>
                      {selectedListing.status}
                    </span>
                  </strong>

                </div>

              </div>


              <div className="admin-modal-description">

                <span>Description</span>

                <p>
                  {selectedListing.description}
                </p>

              </div>

            </div>


            {/* MODERATION ACTIONS */}

            <div className="admin-listing-actions">

              {selectedListing.status === "Pending" && (
                <>
                  <button
                    className="admin-action-reject"
                    onClick={() =>
                      updateStatus(
                        selectedListing.id,
                        "Rejected"
                      )
                    }
                  >
                    <X size={16} />
                    Reject
                  </button>

                  <button
                    className="admin-action-approve"
                    onClick={() =>
                      updateStatus(
                        selectedListing.id,
                        "Active"
                      )
                    }
                  >
                    <Check size={16} />
                    Approve Listing
                  </button>
                </>
              )}


              {selectedListing.status === "Active" && (
                <button
                  className="admin-action-suspend"
                  onClick={() =>
                    updateStatus(
                      selectedListing.id,
                      "Suspended"
                    )
                  }
                >
                  <Ban size={16} />
                  Suspend Listing
                </button>
              )}


              {selectedListing.status === "Suspended" && (
                <button
                  className="admin-action-approve"
                  onClick={() =>
                    updateStatus(
                      selectedListing.id,
                      "Active"
                    )
                  }
                >
                  <Check size={16} />
                  Reactivate Listing
                </button>
              )}

            </div>

          </div>

        </div>

      )}

      </main>

    </div>
  );
}

export default AdminListings;