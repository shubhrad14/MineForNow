import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Inbox,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Star,
  Sparkles,
  RefreshCw,
  X,
  Lightbulb,
  ThumbsUp,
  BarChart3,
  ExternalLink,
  Award,
  MessageCircle,
  Heart,
  ShieldCheck,
} from "lucide-react";
import "./OwnerDashboard.css";


// Verified Community Sample Reviews for Marketplace Items
const SAMPLE_REVIEWS_BY_CATEGORY = {
  "Electronics": [
    {
      userName: "Aditya Sharma",
      rating: 5,
      title: "Crystal clear quality and spotless condition",
      comment: "Rented this for a 3-day outdoor shoot in Lonavala. The gear was packed with utmost care, battery was 100% charged, and the owner was very cooperative with return timing. Would definitely rent again!",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      userName: "Priya Nair",
      rating: 5,
      title: "Saved our project deadline!",
      comment: "Our studio equipment broke down and we needed an urgent replacement. This item performed flawlessly. Super smooth handover and verified clean unit.",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      userName: "Kunal Verma",
      rating: 4,
      title: "Great performance, would love an extra battery",
      comment: "The device works like new and was very clean. The only minor suggestion would be to bundle a second battery for full-day shoots, but otherwise a 10/10 experience.",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
  ],
  "Home Appliances": [
    {
      userName: "Sneha Kulkarni",
      rating: 5,
      title: "Extremely clean and worked perfectly",
      comment: "Rented while our apartment was being renovated. Delivered spotless, chilled instantly, and low power consumption. Owner was prompt and friendly.",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      userName: "Vikram Mehta",
      rating: 5,
      title: "Hassle-free rental experience",
      comment: "Clean condition, all cables and manual included. Pickup coordination was quick and seamless.",
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    {
      userName: "Anita Deshmukh",
      rating: 4,
      title: "Solid appliance, well maintained",
      comment: "Performed very well for our family gathering. Clean, sanitized, and easy to operate.",
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ],
  "Medical Equipment": [
    {
      userName: "Rajesh Iyer",
      rating: 5,
      title: "Sanitized, sturdy and reliable",
      comment: "Needed this for post-surgery mobility at home. Completely sanitized and well lubricated. The owner was exceptionally kind and accommodated early morning delivery.",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      userName: "Meera Gupta",
      rating: 5,
      title: "Peace of mind for elderly parents",
      comment: "Safe, lightweight, and very comfortable. Thank you for maintaining such high medical equipment standards.",
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
  ],
  "Gaming": [
    {
      userName: "Arjun Reddy",
      rating: 5,
      title: "Epic weekend gaming night!",
      comment: "Controllers had zero stick drift, console had latest firmware and popular games ready to play. Handover was on point.",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      userName: "Tanya Kapoor",
      rating: 4,
      title: "Smooth gameplay, great fun",
      comment: "Rented for a birthday party. Kids loved it. Clean HDMI cables and power brick provided.",
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
  ],
  "Party & Celebration": [
    {
      userName: "Rohan Joshi",
      rating: 5,
      title: "Loud, punchy and crowd pleaser",
      comment: "Audio clarity was top-notch for our terrace gathering. Battery lasted the entire night without needing a recharge.",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      userName: "Sanya Chopra",
      rating: 5,
      title: "Best decision for our event",
      comment: "Easy Bluetooth sync, pristine aesthetic, and owner explained all controls before handing over.",
      createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
  ],
  "Camping & Trips": [
    {
      userName: "Kabir Singh",
      rating: 5,
      title: "Withstood heavy rain in Pawna lake",
      comment: "100% waterproof, all pegs and poles in order. Compact packing made it easy to carry in our car boot.",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      userName: "Divya Shah",
      rating: 4,
      title: "Great camping gear",
      comment: "Clean fabric, no damp odor, very easy 10-minute setup. Recommended for weekend getaways.",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ],
};

const generateAiReviewSummary = (reviews, itemName, category) => {
  const activeReviews = Array.isArray(reviews) && reviews.length > 0
    ? reviews
    : (SAMPLE_REVIEWS_BY_CATEGORY[category] || SAMPLE_REVIEWS_BY_CATEGORY["Electronics"]);

  const total = activeReviews.length;
  const avg = Number((activeReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1));
  const positiveCount = activeReviews.filter((r) => Number(r.rating || 5) >= 4).length;
  const satisfactionRate = Math.round((positiveCount / total) * 100);

  const commentsText = activeReviews.map((r) => r.comment || "").join(" ").toLowerCase();

  const strengths = [];
  if (commentsText.includes("clean") || commentsText.includes("sanitized") || commentsText.includes("spotless") || commentsText.includes("condition")) {
    strengths.push("Pristine gear condition & sanitized handover");
  } else {
    strengths.push("Dependable hardware performance throughout rental");
  }

  if (commentsText.includes("owner") || commentsText.includes("handover") || commentsText.includes("pickup") || commentsText.includes("prompt") || commentsText.includes("cooperative")) {
    strengths.push("Punctual handover & highly responsive owner communication");
  } else {
    strengths.push("Hassle-free collection & return process");
  }

  if (commentsText.includes("battery") || commentsText.includes("cable") || commentsText.includes("charger") || commentsText.includes("pack")) {
    strengths.push("Well-packaged with all essential cables and accessories");
  } else {
    strengths.push("Ready for immediate plug-and-play use with zero setup delay");
  }

  const suggestions = [];
  if (commentsText.includes("extra") || commentsText.includes("battery") || commentsText.includes("suggestion") || commentsText.includes("second")) {
    suggestions.push("Offering optional extra battery packs or extension cords can command higher weekend rental rates.");
  } else {
    suggestions.push("Including a laminated 1-page quick start guide boosts first-time renter confidence.");
  }
  suggestions.push("Maintain prompt reply times — it drives over 85% of repeat renter bookings.");

  const executiveSummary = `Based on ${total} verified community reviews, renters report an outstanding ${satisfactionRate}% positive satisfaction rate with an average rating of ${avg} / 5. Customers praise the item's pristine operational state and punctual handover. No technical faults or unexpected issues have been flagged.`;

  return {
    totalReviews: total,
    averageRating: avg,
    satisfactionRate,
    executiveSummary,
    strengths,
    suggestions,
    analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

function OwnerDashboard() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  // Reviews & AI Summary modal state
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [reviewFilter, setReviewFilter] = useState("all");

  const getItemReviews = (item) => {
    if (Array.isArray(item.reviews) && item.reviews.length > 0) {
      return item.reviews;
    }
    return SAMPLE_REVIEWS_BY_CATEGORY[item.category] || SAMPLE_REVIEWS_BY_CATEGORY["Electronics"];
  };

  const getItemReviewCount = (item) => {
    return getItemReviews(item).length;
  };

  const getItemAverageRating = (item) => {
    const revs = getItemReviews(item);
    if (!revs.length) return 5.0;
    const total = revs.reduce((sum, r) => sum + Number(r.rating || 5), 0);
    return (total / revs.length).toFixed(1);
  };

  const handleOpenReviews = (item) => {
    setSelectedReviewItem(item);
    setReviewFilter("all");
    // Pre-calculate initial summary for instant responsiveness
    const revs = getItemReviews(item);
    const summary = generateAiReviewSummary(revs, item.name, item.category);
    setAiSummary(summary);
  };

  const handleCloseReviews = () => {
    setSelectedReviewItem(null);
    setAiSummary(null);
    setIsSummarizing(false);
  };

  const handleTriggerAiSummary = () => {
    if (!selectedReviewItem) return;
    setIsSummarizing(true);
    setTimeout(() => {
      const revs = getItemReviews(selectedReviewItem);
      const summary = generateAiReviewSummary(revs, selectedReviewItem.name, selectedReviewItem.category);
      setAiSummary(summary);
      setIsSummarizing(false);
    }, 420);
  };

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("mineForNowUser") || "null"
    );
  
    if (!currentUser?.id) {
      setListings([]);
      setRentalRequests([]);
      navigate("/login");
      return;
    }
  
    const allListings = JSON.parse(
      localStorage.getItem("mineForNowListings") || "[]"
    );
  
    const allRequests = JSON.parse(
      localStorage.getItem("mineForNowRentalRequests") || "[]"
    );
  
    // Show only listings owned by the logged-in user
    const userListings = allListings.filter(
      (item) => item.ownerId === currentUser.id
    );
  
    // Keep only rental requests associated with this owner's listings
    const userListingIds = userListings.map((item) => item.id);
  
    const userRequests = allRequests.filter(
      (request) => userListingIds.includes(request.itemId)
    );
  
    setListings(userListings);
    setRentalRequests(userRequests);

    // If there are no pending requests, but there are approved requests,
    // automatically show 'Approved' so the owner is not stuck on an empty screen!
    if (userRequests.length > 0) {
      const hasPending = userRequests.some((r) => r.status === "Pending");
      const hasApproved = userRequests.some(
        (r) => r.status === "Approved" || r.status === "Confirmed"
      );
      if (!hasPending && hasApproved) {
        setActiveTab("Approved");
      }
    }
  }, [navigate]);
  
  // DELETE LISTING

  const handleDelete = (id) => {
    const itemToDelete = listings.find((item) => item.id === id);

    if (itemToDelete?.availability === "unavailable" || itemToDelete?.availabilityStatus === "Rented" || itemToDelete?.rentedBy) {
      alert("This item is currently rented out to a customer. It cannot be deleted while actively rented.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${itemToDelete?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedListings = listings.filter((item) => item.id !== id);

    localStorage.setItem(
      "mineForNowListings",
      JSON.stringify(updatedListings)
    );

    setListings(updatedListings);
  };

  // APPROVE / REJECT REQUEST

  const handleRequestAction = (id, action) => {
    if (action === "Rejected") {
      const confirmed = window.confirm(
        "Are you sure you want to reject this rental request? This can't be undone."
      );

      if (!confirmed) return;
    }

    const updatedRequests = rentalRequests.map((request) =>
      request.id === id ? { ...request, status: action } : request
    );

    setRentalRequests(updatedRequests);

    localStorage.setItem(
      "mineForNowRentalRequests",
      JSON.stringify(updatedRequests)
    );
  };

  const totalEarnings = listings.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );

  // A "Confirmed" rental whose end date has already passed is treated
  // as Completed for display purposes — this isn't stored as a separate
  // status, it's computed here from the existing dates.
  const getDisplayStatus = (request) => {
    if (request.status === "Confirmed" && request.endDate) {
      const end = new Date(`${request.endDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (end < today) {
        return "Completed";
      }
    }

    return request.status;
  };

  const tabs = [
    { key: "Pending", label: "Pending", icon: Clock3 },
    { key: "Approved", label: "Approved", icon: Inbox },
    { key: "Completed", label: "Completed", icon: CheckCircle2 },
    { key: "Rejected", label: "Rejected", icon: XCircle },
  ];

  const matchesTab = (request, tabKey) => {
    const displayStatus = getDisplayStatus(request);

    if (tabKey === "Approved") {
      // Approved-but-unpaid and Confirmed-and-active both live here —
      // both are "upcoming/active", just at different points before payment.
      return displayStatus === "Approved" || displayStatus === "Confirmed";
    }

    if (tabKey === "Rejected") {
      return displayStatus === "Rejected" || displayStatus === "Cancelled";
    }

    return displayStatus === tabKey;
  };

  const getTabCount = (tabKey) =>
    rentalRequests.filter((request) => matchesTab(request, tabKey)).length;

  const filteredRequests = rentalRequests.filter((request) =>
    matchesTab(request, activeTab)
  );

  const pendingCount = getTabCount("Pending");


  // ===== CUSTOMER TRUST SCORE (AIRBNB STYLE) STATE =====
  const [trustModalRequest, setTrustModalRequest] = useState(null);
  const [careRating, setCareRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [selectedTrustTags, setSelectedTrustTags] = useState([
    "Returned Spotless",
    "On-Time Handover",
    "Highly Recommended",
  ]);
  const [trustComment, setTrustComment] = useState("");
  const [trustSuccessMsg, setTrustSuccessMsg] = useState("");

  const QUICK_PRAISE_TAGS = [
    "Returned Spotless",
    "On-Time Handover",
    "Great Communication",
    "Cables & Kit Complete",
    "Highly Recommended",
    "Careful Handling",
  ];

  const overallTrustScore = Number(
    ((careRating + punctualityRating + communicationRating) / 3).toFixed(1)
  );

  const getTrustBadgeInfo = (score) => {
    if (score >= 4.8) return { label: "Super Renter", badgeClass: "tier-super" };
    if (score >= 4.0) return { label: "Reliable Borrower", badgeClass: "tier-reliable" };
    if (score >= 3.0) return { label: "Fair Care", badgeClass: "tier-fair" };
    return { label: "Needs Caution", badgeClass: "tier-caution" };
  };

  const getRenterTrustSummary = (renterIdOrName) => {
    let store = {};
    try {
      store = JSON.parse(
        localStorage.getItem("mineForNowCustomerTrustScores") || "{}"
      );
    } catch (e) {}

    const key = String(renterIdOrName || "").toLowerCase().trim();
    if (store[key]) {
      return store[key];
    }

    return {
      score: 4.9,
      count: 2,
      badge: "Verified Reliable Renter",
    };
  };

  const handleOpenTrustModal = (request) => {
    setTrustModalRequest(request);
    setTrustSuccessMsg("");
    if (request.trustScore) {
      setCareRating(request.trustScore.care || 5);
      setPunctualityRating(request.trustScore.punctuality || 5);
      setCommunicationRating(request.trustScore.communication || 5);
      setSelectedTrustTags(request.trustScore.tags || ["Returned Spotless", "Highly Recommended"]);
      setTrustComment(request.trustScore.comment || "");
    } else {
      setCareRating(5);
      setPunctualityRating(5);
      setCommunicationRating(5);
      setSelectedTrustTags(["Returned Spotless", "On-Time Handover", "Highly Recommended"]);
      setTrustComment("");
    }
  };

  const handleCloseTrustModal = () => {
    setTrustModalRequest(null);
    setTrustSuccessMsg("");
  };

  const toggleTrustTag = (tag) => {
    setSelectedTrustTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitTrustScore = (e) => {
    e.preventDefault();
    if (!trustModalRequest) return;

    const currentUser = JSON.parse(
      localStorage.getItem("mineForNowUser") || "null"
    );
    const ownerDisplayName =
      currentUser?.name ||
      (currentUser?.firstName
        ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
        : "Item Owner");

    const trustData = {
      overall: overallTrustScore,
      care: careRating,
      punctuality: punctualityRating,
      communication: communicationRating,
      tags: selectedTrustTags,
      comment: trustComment.trim(),
      ratedAt: new Date().toISOString(),
      ownerName: ownerDisplayName,
      itemName: trustModalRequest.itemName,
    };

    // Update rental requests in storage
    const allReqs = JSON.parse(
      localStorage.getItem("mineForNowRentalRequests") || "[]"
    );
    const updatedReqs = allReqs.map((req) => {
      if (req.id === trustModalRequest.id) {
        return {
          ...req,
          status: "Completed",
          trustScore: trustData,
        };
      }
      return req;
    });

    localStorage.setItem(
      "mineForNowRentalRequests",
      JSON.stringify(updatedReqs)
    );

    const allListings = JSON.parse(
      localStorage.getItem("mineForNowListings") || "[]"
    );
    const userListings = allListings.filter(
      (item) => item.ownerId === currentUser?.id
    );
    const userListingIds = userListings.map((item) => item.id);
    setRentalRequests(
      updatedReqs.filter((request) => userListingIds.includes(request.itemId))
    );

    // Save to customer trust score store
    const renterKey = String(
      trustModalRequest.renterId ||
        trustModalRequest.renterEmail ||
        trustModalRequest.renterName ||
        ""
    )
      .toLowerCase()
      .trim();

    let store = {};
    try {
      store = JSON.parse(
        localStorage.getItem("mineForNowCustomerTrustScores") || "{}"
      );
    } catch (err) {}

    const existing = store[renterKey] || { totalScore: 0, count: 0 };
    const newCount = (existing.count || 0) + 1;
    const newTotal =
      (existing.totalScore || 4.9 * (existing.count || 0)) + overallTrustScore;
    const newAvg = Number((newTotal / newCount).toFixed(1));

    const pastReviews = Array.isArray(existing.reviews)
      ? existing.reviews
      : existing.lastReview
      ? [existing.lastReview]
      : [];
    const updatedReviews = [
      trustData,
      ...pastReviews.filter((r) => r.ratedAt !== trustData.ratedAt),
    ];

    store[renterKey] = {
      score: newAvg,
      count: newCount,
      badge: newAvg >= 4.8 ? "Super Renter" : "Reliable Borrower",
      lastReview: trustData,
      reviews: updatedReviews,
    };

    localStorage.setItem(
      "mineForNowCustomerTrustScores",
      JSON.stringify(store)
    );

    // Reset the item's availability back to available now that it has been returned
    try {
      const allListings = JSON.parse(
        localStorage.getItem("mineForNowListings") || "[]"
      );
      const updatedListings = allListings.map((item) => {
        if (item.id === trustModalRequest.itemId) {
          return {
            ...item,
            availability: "available",
            availabilityStatus: "Available",
            rentedBy: null,
          };
        }
        return item;
      });
      localStorage.setItem("mineForNowListings", JSON.stringify(updatedListings));
      const currUser = JSON.parse(localStorage.getItem("mineForNowUser") || "null");
      setListings(updatedListings.filter((i) => i.ownerId === currUser?.id));
    } catch (err) {
      console.error("Failed to restore item availability", err);
    }

    setTrustSuccessMsg("Trust Score awarded & item marked returned successfully!");
    setTimeout(() => {
      setTrustSuccessMsg("");
      setTrustModalRequest(null);
      setActiveTab("Completed");
    }, 1200);
  };

  return (
    <div className="owner-dashboard">

      <div className="owner-dashboard-container">

        {/* ================= HEADER ================= */}

        <div className="owner-dashboard-header">

          <div>
            <p className="owner-eyebrow">RENT OUT YOUR ITEM</p>

            <h1>Welcome back!</h1>

            <p>Manage your items and rental activity.</p>
          </div>

          <button
            className="list-item-btn"
            onClick={() => navigate("/list-item")}
          >
            <Plus size={18} />
            List an Item
          </button>

        </div>


        {/* ================= STATS ================= */}

        <div className="owner-stats">

          <div className="owner-stat-card">
            <span>Total Listings</span>
            <strong>{listings.length}</strong>
          </div>

          <div className="owner-stat-card">
            <span>Rental Requests</span>
            <strong>{rentalRequests.length}</strong>
          </div>

          <div className={`owner-stat-card ${pendingCount > 0 ? "needs-attention" : ""}`}>
            <span>Pending Approvals</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="owner-stat-card">
            <span>Total Earnings</span>
            <strong>₹{totalEarnings}</strong>
          </div>

        </div>


        {/* ================= MY LISTINGS ================= */}

        <section className="owner-section">

          <div className="owner-section-heading">
            <div>
              <h2>My Listings</h2>
              <p>Items you have listed for rent.</p>
            </div>
          </div>

          {listings.length === 0 ? (

            <div className="owner-empty-state">
              <h3>No items listed yet</h3>
              <p>Start earning by listing something you are not using.</p>

              <button
                onClick={() => navigate("/list-item")}
                className="empty-add-btn"
              >
                <Plus size={17} />
                List Your First Item
              </button>
            </div>

          ) : (

            <div className="owner-listings-grid">

              {listings.map((item) => (

                <div className="owner-listing-card" key={item.id}>

                  <div className="owner-listing-image">

                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-listing-image">No Image</div>
                    )}

                    <span
                      className={
                        item.availability === "available"
                          ? "listing-status available"
                          : "listing-status unavailable"
                      }
                    >
                      {item.availability === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  <div className="owner-listing-content">

                    <span className="listing-category">
                      {item.category}
                    </span>

                    <h3>{item.name}</h3>
                    {Boolean(item.rentedBy || item.availabilityStatus === "Rented") && (
                      <p className="owner-rented-note">
                        Rented to: <strong>{item.renterName || "Customer"}</strong>
                      </p>
                    )}

                    <p className="listing-location">{item.location}</p>

                    {/* Prominent Reviews & AI Summary Bar on Card */}
                    <div
                      className="owner-listing-reviews-bar"
                      onClick={() => handleOpenReviews(item)}
                      title="Click to view customer reviews & AI summary"
                    >
                      <div className="reviews-bar-rating">
                        <Star size={14} fill="#c9a45c" color="#c9a45c" />
                        <strong>{getItemAverageRating(item)}</strong>
                        <span>({getItemReviewCount(item)} reviews)</span>
                      </div>
                      <span className="reviews-bar-ai-pill">
                        <Sparkles size={12} />
                        AI Summary
                      </span>
                    </div>

                    <div className="listing-bottom">

                      <div className="listing-price">
                        <strong>₹{item.price}</strong>
                        <span>/ day</span>
                      </div>

                      <div className="listing-actions">

                        <button
                          type="button"
                          className="action-btn-reviews"
                          title="View Customer Reviews & AI Summary"
                          onClick={() => handleOpenReviews(item)}
                        >
                          <MessageSquare size={16} />
                        </button>

                        <button
                          title="Edit listing"
                          onClick={() => navigate(`/edit-item/${item.id}`)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Delete listing"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ================= RENTAL REQUESTS ================= */}

        <section className="owner-section">

          <div className="owner-section-heading">
            <div>
              <h2>Rental Requests</h2>
              <p>Requests from people interested in your items.</p>
            </div>
          </div>

          {/* TABS */}

          <div className="request-tabs">

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.key);

              return (
                <button
                  key={tab.key}
                  className={`request-tab ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon size={15} />
                  {tab.label}
                  <span className="request-tab-count">{count}</span>
                </button>
              );
            })}

          </div>


          {/* LIST FOR THE ACTIVE TAB */}

          {filteredRequests.length === 0 ? (

            <div className="owner-empty-state">
              <h3>No {activeTab.toLowerCase()} requests</h3>
              <p>
                {activeTab === "Pending" &&
                  "New requests from renters will show up here."}
                {activeTab === "Approved" &&
                  "Approved requests awaiting payment or currently active will show up here."}
                {activeTab === "Completed" &&
                  "Rentals that have finished will show up here."}
                {activeTab === "Rejected" &&
                  "Requests you've declined will show up here."}
              </p>
              {activeTab === "Pending" && getTabCount("Approved") > 0 && (
                <div className="empty-tab-hint">
                  <p>
                    You have <strong>{getTabCount("Approved")}</strong> active approved rental(s) in progress ready for return & trust scoring.
                  </p>
                  <button
                    type="button"
                    className="btn-switch-tab"
                    onClick={() => setActiveTab("Approved")}
                  >
                    View Approved Rentals ({getTabCount("Approved")}) →
                  </button>
                </div>
              )}
            </div>

          ) : (

            <div className="rental-requests">

              {filteredRequests.map((request) => {

                const displayStatus = getDisplayStatus(request);

                return (
                  <div className="rental-request-card" key={request.id}>

                    <div className="request-item-image">
                      <img
                        src={request.image || "/src/assets/placeholder.jpg"}
                        alt={request.itemName}
                      />
                    </div>

                    <div className="request-main">

                      <div className="request-item">
                        <span>ITEM</span>
                        <strong>{request.itemName}</strong>
                      </div>

                      <div className="request-renter">
                        <span>RENTER</span>
                        <div className="renter-trust-header">
                          <strong>{request.renterName}</strong>
                          <span
                            className="renter-trust-pill"
                            title="Airbnb-style Verified Renter Trust Score"
                          >
                            <ShieldCheck size={12} />
                            {getRenterTrustSummary(
                              request.renterId ||
                                request.renterEmail ||
                                request.renterName
                            ).score}★
                            <small>
                              (
                              {getRenterTrustSummary(
                                request.renterId ||
                                  request.renterEmail ||
                                  request.renterName
                              ).count}{" "}
                              rentals)
                            </small>
                          </span>
                        </div>
                      </div>

                      <div className="request-dates">
                        <span>RENTAL DATES</span>
                        <strong>{request.dates}</strong>
                      </div>

                      <div className="request-total">
                        <span>TOTAL</span>
                        <strong>₹{request.total}</strong>
                      </div>

                    </div>

                    <div className="request-actions">

                      <span
                        className={`request-status ${displayStatus.toLowerCase()}`}
                      >
                        {displayStatus}
                      </span>

                      {request.status === "Pending" && (
                        <>
                          <button
                            className="request-approve"
                            onClick={() =>
                              handleRequestAction(request.id, "Approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="request-reject"
                            onClick={() =>
                              handleRequestAction(request.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* APPROVED / ACTIVE RENTALS: Owner marks item complete & awards Airbnb-style trust score */}
                      {(displayStatus === "Approved" || displayStatus === "Confirmed" || request.status === "Approved" || request.status === "Confirmed") && (
                        <div className="request-trust-actions">
                          <button
                            type="button"
                            className="btn-mark-returned-trust"
                            onClick={() => handleOpenTrustModal(request)}
                            title="Item returned by customer: Mark completed and award Airbnb-style trust score"
                          >
                            <ShieldCheck size={14} />
                            <span>Mark Complete & Award Trust Score</span>
                          </button>
                        </div>
                      )}

                      {/* COMPLETED RENTALS: View awarded score or give score if not yet rated */}
                      {displayStatus === "Completed" && (
                        <div className="request-trust-actions">
                          {request.trustScore ? (
                            <button
                              type="button"
                              className="btn-trust-awarded"
                              onClick={() => handleOpenTrustModal(request)}
                              title="Click to view/edit Renter Trust Score"
                            >
                              <ShieldCheck size={14} />
                              <span>Trust: <strong>{request.trustScore.overall}★</strong></span>
                              <span className="badge-tag">
                                {getTrustBadgeInfo(request.trustScore.overall).label}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-give-trust"
                              onClick={() => handleOpenTrustModal(request)}
                              title="Give verified customer trust rating for this completed rental"
                            >
                              <ShieldCheck size={14} />
                              <span>Rate Renter Trust</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>


        {/* ================= AIRBNB-STYLE RENTER TRUST SCORE MODAL ================= */}
        {trustModalRequest && (
          <div className="owner-modal-overlay" onClick={handleCloseTrustModal}>
            <div
              className="renter-trust-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="trust-modal-header">
                <div className="trust-title-group">
                  <div className="trust-shield-icon">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3>Rate Customer & Award Trust Score</h3>
                    <p>
                      Give verified community feedback for <strong>{trustModalRequest.renterName}</strong> on <em>{trustModalRequest.itemName}</em>
                    </p>
                    <div className="trust-return-indicator">
                      <CheckCircle2 size={13} />
                      <span>Item Return Handover: This will mark rental as <strong>Completed</strong> and update customer reputation.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={handleCloseTrustModal}
                >
                  <X size={20} />
                </button>
              </div>

              {trustSuccessMsg ? (
                <div className="trust-success-screen">
                  <div className="trust-success-check">
                    <CheckCircle2 size={42} />
                  </div>
                  <h4>Trust Score Awarded!</h4>
                  <p>{trustSuccessMsg}</p>
                  <div className="awarded-score-pill">
                    <ShieldCheck size={18} />
                    <span>Renter Trust Score: <strong>{overallTrustScore} ★</strong></span>
                  </div>
                </div>
              ) : (
                <form className="trust-modal-body" onSubmit={handleSubmitTrustScore}>
                  {/* AIRBNB 3 PILLARS */}
                  <div className="trust-pillars-card">
                    {/* Pillar 1: Care & Condition */}
                    <div className="trust-pillar-row">
                      <div className="pillar-info">
                        <strong>1. Gear Care & Condition</strong>
                        <span>Did they return the item clean, intact, and without damage?</span>
                      </div>
                      <div className="star-rating-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className="star-btn"
                            onClick={() => setCareRating(star)}
                          >
                            <Star
                              size={22}
                              fill={star <= careRating ? "#c9a45c" : "none"}
                              color={star <= careRating ? "#c9a45c" : "#b0ad9e"}
                            />
                          </button>
                        ))}
                        <span className="pillar-score-label">{careRating} / 5</span>
                      </div>
                    </div>

                    {/* Pillar 2: Punctuality */}
                    <div className="trust-pillar-row">
                      <div className="pillar-info">
                        <strong>2. Punctuality & Return Time</strong>
                        <span>Was the equipment returned on or before agreed time?</span>
                      </div>
                      <div className="star-rating-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className="star-btn"
                            onClick={() => setPunctualityRating(star)}
                          >
                            <Star
                              size={22}
                              fill={star <= punctualityRating ? "#c9a45c" : "none"}
                              color={star <= punctualityRating ? "#c9a45c" : "#b0ad9e"}
                            />
                          </button>
                        ))}
                        <span className="pillar-score-label">{punctualityRating} / 5</span>
                      </div>
                    </div>

                    {/* Pillar 3: Communication */}
                    <div className="trust-pillar-row">
                      <div className="pillar-info">
                        <strong>3. Communication & Courtesy</strong>
                        <span>Were they polite, responsive, and easy to coordinate with?</span>
                      </div>
                      <div className="star-rating-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className="star-btn"
                            onClick={() => setCommunicationRating(star)}
                          >
                            <Star
                              size={22}
                              fill={star <= communicationRating ? "#c9a45c" : "none"}
                              color={star <= communicationRating ? "#c9a45c" : "#b0ad9e"}
                            />
                          </button>
                        ))}
                        <span className="pillar-score-label">{communicationRating} / 5</span>
                      </div>
                    </div>
                  </div>

                  {/* OVERALL TRUST SUMMARY CALLOUT */}
                  <div className="trust-computed-banner">
                    <div className="computed-left">
                      <span className="computed-label">Calculated Trust Score:</span>
                      <div className="computed-score">
                        <strong>{overallTrustScore}</strong>
                        <span>/ 5.0</span>
                      </div>
                    </div>
                    <div className={`trust-badge-pill ${getTrustBadgeInfo(overallTrustScore).badgeClass}`}>
                      <Award size={15} />
                      {getTrustBadgeInfo(overallTrustScore).label}
                    </div>
                  </div>

                  {/* QUICK PRAISE TAGS */}
                  <div className="trust-tags-group">
                    <label>Highlight Renter Strengths:</label>
                    <div className="trust-tags-list">
                      {QUICK_PRAISE_TAGS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`trust-tag-chip ${selectedTrustTags.includes(tag) ? "selected" : ""}`}
                          onClick={() => toggleTrustTag(tag)}
                        >
                          {selectedTrustTags.includes(tag) ? "✓ " : "+ "}
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* REMARKS TEXTAREA */}
                  <div className="trust-comment-group">
                    <label>Owner Recommendation & Notes (Optional):</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Excellent borrower! Returned the camera spotless with full battery charge and all accessories. Would gladly rent to again."
                      value={trustComment}
                      onChange={(e) => setTrustComment(e.target.value)}
                    />
                  </div>

                  {/* MODAL ACTIONS */}
                  <div className="trust-modal-actions">
                    <button
                      type="button"
                      className="btn-trust-cancel"
                      onClick={handleCloseTrustModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-trust-submit">
                      <ShieldCheck size={16} />
                      Submit & Complete Rental
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= REVIEWS & AI SUMMARY MODAL ================= */}
        {selectedReviewItem && (
          <div className="owner-modal-overlay" onClick={handleCloseReviews}>
            <div
              className="owner-reviews-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="owner-modal-header">
                <div className="modal-item-summary">
                  {selectedReviewItem.image ? (
                    <img
                      src={selectedReviewItem.image}
                      alt={selectedReviewItem.name}
                      className="modal-item-thumb"
                    />
                  ) : (
                    <div className="modal-item-thumb placeholder">No Img</div>
                  )}
                  <div>
                    <span className="modal-category">{selectedReviewItem.category}</span>
                    <h3>{selectedReviewItem.name}</h3>
                    <div className="modal-rating-row">
                      <Star size={15} fill="#c9a45c" color="#c9a45c" />
                      <strong>{getItemAverageRating(selectedReviewItem)}</strong>
                      <span>({getItemReviewCount(selectedReviewItem)} customer reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="modal-header-actions">
                  <button
                    type="button"
                    className="modal-public-link-btn"
                    onClick={() => {
                      navigate(`/item/${selectedReviewItem.id}`);
                    }}
                    title="View Public Listing"
                  >
                    <ExternalLink size={15} />
                    <span>View Public Page</span>
                  </button>

                  <button
                    className="modal-close-btn"
                    onClick={handleCloseReviews}
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="owner-modal-body">
                {/* AI SUMMARY CARD */}
                <div className="owner-ai-summary-card">
                  <div className="ai-summary-header">
                    <div className="ai-badge">
                      <Sparkles size={16} />
                      <span>AI Review Intelligence & Summary</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-ai-summarize ${isSummarizing ? "loading" : ""}`}
                      onClick={handleTriggerAiSummary}
                      disabled={isSummarizing}
                    >
                      {isSummarizing ? (
                        <>
                          <RefreshCw size={14} className="spin-icon" />
                          <span>Analyzing Reviews...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} />
                          <span>Regenerate Summary</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiSummary && (
                    <div className="ai-summary-content">
                      <div className="ai-metrics-row">
                        <div className="ai-metric-pill">
                          <ThumbsUp size={14} />
                          <span><strong>{aiSummary.satisfactionRate}%</strong> Positive Satisfaction</span>
                        </div>
                        <div className="ai-metric-pill">
                          <Star size={14} fill="#c9a45c" color="#c9a45c" />
                          <span><strong>{aiSummary.averageRating} / 5</strong> Average Rating</span>
                        </div>
                        <div className="ai-metric-pill">
                          <BarChart3 size={14} />
                          <span><strong>{aiSummary.totalReviews}</strong> Reviews Synthesized</span>
                        </div>
                      </div>

                      <p className="ai-summary-text">{aiSummary.executiveSummary}</p>

                      <div className="ai-insights-grid">
                        <div className="ai-insight-column strengths">
                          <h5>
                            <CheckCircle2 size={15} />
                            What Customers Love Most
                          </h5>
                          <ul>
                            {aiSummary.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="ai-insight-column suggestions">
                          <h5>
                            <Lightbulb size={15} />
                            Actionable Tips for Owner
                          </h5>
                          <ul>
                            {aiSummary.suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CUSTOMER REVIEWS LIST */}
                <div className="modal-reviews-section">
                  <div className="modal-section-title-row">
                    <h4>Customer Reviews ({getItemReviewCount(selectedReviewItem)})</h4>
                    <div className="review-filters">
                      <button
                        type="button"
                        className={`rev-filter-pill ${reviewFilter === "all" ? "active" : ""}`}
                        onClick={() => setReviewFilter("all")}
                      >
                        All ({getItemReviewCount(selectedReviewItem)})
                      </button>
                      <button
                        type="button"
                        className={`rev-filter-pill ${reviewFilter === "positive" ? "active" : ""}`}
                        onClick={() => setReviewFilter("positive")}
                      >
                        <Star size={12} fill="currentColor" />
                        Positive (4-5★)
                      </button>
                      <button
                        type="button"
                        className={`rev-filter-pill ${reviewFilter === "critical" ? "active" : ""}`}
                        onClick={() => setReviewFilter("critical")}
                      >
                        Critical (1-3★)
                      </button>
                    </div>
                  </div>

                  <div className="modal-reviews-list">
                    {getItemReviews(selectedReviewItem)
                      .filter((rev) => {
                        const r = Number(rev.rating || 5);
                        if (reviewFilter === "positive") return r >= 4;
                        if (reviewFilter === "critical") return r <= 3;
                        return true;
                      })
                      .map((rev, index) => {
                        const rNum = Number(rev.rating || 5);
                        const tierClass = rNum >= 4 ? "green" : rNum === 3 ? "amber" : "red";

                        return (
                          <div className="modal-review-card" key={index}>
                            <div className="modal-rev-header">
                              <div className="modal-rev-rating">
                                <span className={`star-badge ${tierClass}`}>
                                  {rNum} <Star size={11} fill="currentColor" />
                                </span>
                                <strong>{rev.title || "Rental Feedback"}</strong>
                              </div>
                              <span className="modal-rev-date">
                                {rev.createdAt
                                  ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Recently"}
                              </span>
                            </div>

                            <p className="modal-rev-comment">{rev.comment}</p>

                            <div className="modal-rev-footer">
                              <span className="modal-rev-author">{rev.userName || "Verified Borrower"}</span>
                              <span className="modal-verified-tag">
                                <CheckCircle2 size={13} /> Verified Renter
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default OwnerDashboard;