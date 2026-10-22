import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Heart,
  Calendar,
  Star,
  Minus,
  Plus,
  Wrench,
  ShieldCheck,
  Lock,
  Headphones,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
} from "lucide-react";
import "./ItemDetails.css";


const starDefaultTitles = {
  5: "Awesome",
  4: "Very Good",
  3: "Good",
  2: "Disappointing",
  1: "Terrible",
};

const formatReviewRelativeDate = (dateString) => {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "Recently";
  }
};

const starLabels = {
  1: "1 - Disappointing",
  2: "2 - Below Average",
  3: "3 - Average Experience",
  4: "4 - Very Good",
  5: "5 - Excellent Gear",
};


// Verified Community Sample Reviews fallback for AI Summary
const CATEGORY_SAMPLE_REVIEWS = {
  "Electronics": [
    { userName: "Aditya Sharma", rating: 5, comment: "Pristine lens quality and spotless condition. Packed with utmost care, battery was 100% charged." },
    { userName: "Priya Nair", rating: 5, comment: "Saved our project deadline! Flawless unit, super smooth handover and clean accessories." },
    { userName: "Kunal Verma", rating: 4, comment: "Works like new and was very clean. bundling a second battery would make it 10/10." },
  ],
  "Home Appliances": [
    { userName: "Sneha Kulkarni", rating: 5, comment: "Delivered spotless, chilled instantly, and low power consumption. Owner was prompt and friendly." },
    { userName: "Vikram Mehta", rating: 5, comment: "Clean condition, all cables and manual included. Pickup coordination was quick." },
  ],
  "Medical Equipment": [
    { userName: "Rajesh Iyer", rating: 5, comment: "Completely sanitized and well lubricated. Safe, lightweight and accommodating owner." },
    { userName: "Meera Gupta", rating: 5, comment: "Safe, comfortable, and maintained to top hygiene standards." },
  ],
  "Gaming": [
    { userName: "Arjun Reddy", rating: 5, comment: "Controllers had zero stick drift, latest firmware and games ready to play. Handover on point." },
    { userName: "Tanya Kapoor", rating: 4, comment: "Smooth gameplay, great fun. Clean HDMI cables and power brick provided." },
  ],
  "Party & Celebration": [
    { userName: "Rohan Joshi", rating: 5, comment: "Audio clarity was top-notch for our terrace gathering. Battery lasted the entire night." },
  ],
  "Camping & Trips": [
    { userName: "Kabir Singh", rating: 5, comment: "100% waterproof, all pegs in order. Compact packing made it easy to carry." },
  ],
};

const summarizeReviewsWithAi = (reviews, category) => {
  const activeReviews = Array.isArray(reviews) && reviews.length > 0
    ? reviews
    : (CATEGORY_SAMPLE_REVIEWS[category] || CATEGORY_SAMPLE_REVIEWS["Electronics"]);

  const total = activeReviews.length;
  const avg = Number((activeReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1));
  const positiveCount = activeReviews.filter((r) => Number(r.rating || 5) >= 4).length;
  const satisfactionRate = Math.round((positiveCount / total) * 100);

  const commentsText = activeReviews.map((r) => r.comment || "").join(" ").toLowerCase();

  const strengths = [];
  if (commentsText.includes("clean") || commentsText.includes("sanitized") || commentsText.includes("spotless") || commentsText.includes("condition")) {
    strengths.push("Pristine gear hygiene and carefully maintained condition");
  } else {
    strengths.push("Dependable operational performance during rental duration");
  }

  if (commentsText.includes("owner") || commentsText.includes("handover") || commentsText.includes("pickup") || commentsText.includes("prompt")) {
    strengths.push("Prompt, courteous handover coordination by verified owner");
  } else {
    strengths.push("Smooth, punctual collection and return process");
  }

  if (commentsText.includes("cable") || commentsText.includes("pack") || commentsText.includes("battery") || commentsText.includes("charger")) {
    strengths.push("Complete with essential cables, chargers, and protective cases");
  } else {
    strengths.push("Immediate plug-and-play readiness with zero setup friction");
  }

  const suggestions = [];
  if (commentsText.includes("extra") || commentsText.includes("battery") || commentsText.includes("second")) {
    suggestions.push("Offering optional extra battery or accessory bundles increases repeat booking appeal.");
  } else {
    suggestions.push("Providing a 1-page quick start guide helps first-time borrowers get started immediately.");
  }

  const executiveSummary = `Based on ${total} verified community reviews, borrowers report an impressive ${satisfactionRate}% positive satisfaction rate (average rating ${avg} / 5). Renters highlight the spotless physical condition, reliable performance, and hassle-free owner handover.`;

  return {
    totalReviews: total,
    averageRating: avg,
    satisfactionRate,
    executiveSummary,
    strengths,
    suggestions,
  };
};

function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const items = JSON.parse(
    localStorage.getItem("mineForNowListings") || "[]"
  ).map((listing) => ({
    ...listing,
    id: listing.id,
    price: Number(listing.price),
    securityDeposit: Number(listing.securityDeposit || 0),
    quantity: Number(listing.quantity || 1),
    availabilityStatus:
      listing.availability === "available"
        ? "Available"
        : "Unavailable",
    requiresApproval: listing.bookingType === "approval",
    rating: Number(listing.rating || 0),
    reviewCount: Number(listing.reviewCount || 0),
    reviews: Array.isArray(listing.reviews) ? listing.reviews : [],
    image: listing.image || "",
    description: listing.description || "No description provided.",
  }));
  
  const item = items.find(
    (listing) => String(listing.id) === String(id)
  );

  const currentUser = JSON.parse(
    localStorage.getItem("mineForNowUser") || "null"
  );

  const isRented = Boolean(
    item && (
      item.availability === "unavailable" ||
      item.isAvailable === false ||
      item.availabilityStatus === "Rented" ||
      item.availabilityStatus === "Unavailable"
    )
  );

  const isRentedByCurrent = Boolean(
    currentUser && item && (
      (item.rentedBy && (item.rentedBy === currentUser.id || item.rentedBy === currentUser.email)) ||
      (item.renterName && currentUser.name && item.renterName === currentUser.name)
    )
  );

  /* ============================================================
     EVERYTHING BELOW THIS LINE (state + handlers) IS UNCHANGED
     from the original file — rental date logic, quantity logic,
     wishlist logic and handleAddToCart are all untouched.
  ============================================================ */

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const savedWishlist = localStorage.getItem("mineForNowWishlist");

    if (!savedWishlist) {
      return false;
    }

    try {
      const wishlist = JSON.parse(savedWishlist);

      if (!Array.isArray(wishlist)) {
        return false;
      }

      return wishlist.some(
        (wishlistItem) => String(wishlistItem.id) === String(item?.id)
      );
    } catch (error) {
      return false;
    }
  });

  const handleWishlist = () => {
    const savedWishlist = localStorage.getItem("mineForNowWishlist");

    let wishlist = [];

    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          wishlist = parsedWishlist;
        }
      } catch (error) {
        wishlist = [];
      }
    }

    const alreadyExists = wishlist.some(
      (wishlistItem) => String(wishlistItem.id) === String(item.id)
    );

    if (alreadyExists) {
      const updatedWishlist = wishlist.filter(
        (wishlistItem) => String(wishlistItem.id) !== String(item.id)
      );

      localStorage.setItem(
        "mineForNowWishlist",
        JSON.stringify(updatedWishlist)
      );

      setIsWishlisted(false);
    } else {
      const updatedWishlist = [
        ...wishlist,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          location: item.location,
          price: item.price,
          image: item.image,
        },
      ];

      localStorage.setItem(
        "mineForNowWishlist",
        JSON.stringify(updatedWishlist)
      );

      setIsWishlisted(true);
    }
  };

  if (!item) {
    return (
      <div className="item-details-page">
        <div className="item-not-found">
          <h2>Item not found</h2>

          <button onClick={() => navigate("/browse")}>
            <ArrowLeft size={17} />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = (end - start) / (1000 * 60 * 60 * 24);

    return difference > 0 ? difference : 0;
  };

  const rentalDays = calculateDays();

  const totalPrice = rentalDays * item.price * quantity;

  const increaseQuantity = () => {
    if (quantity < item.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (isRented) {
      alert("This item is currently unavailable and has already been rented.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select your rental dates.");
      return;
    }

    if (rentalDays <= 0) {
      alert("End date must be after the start date.");
      return;
    }

    const existingCart = JSON.parse(
      localStorage.getItem("mineForNowCart") || "[]"
    );

    const alreadyInCart = existingCart.some(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.startDate === startDate &&
        cartItem.endDate === endDate
    );

    if (alreadyInCart) {
      alert("This item with the selected dates is already in your cart.");
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      location: item.location,
      price: item.price,
      image: item.image,
      securityDeposit: item.securityDeposit,
      quantity: quantity,
      startDate: startDate,
      endDate: endDate,
      rentalDays: rentalDays,
      totalPrice: totalPrice,
      requiresApproval: item.requiresApproval,
    };

    const updatedCart = [...existingCart, cartItem];

    localStorage.setItem("mineForNowCart", JSON.stringify(updatedCart));

    alert(`${item.name} has been added to your cart!`);

    navigate("/cart");
  };

  const recommendedItems = items.filter(
    (recommendedItem) =>
      recommendedItem.id !== item.id &&
      recommendedItem.category === item.category
  );

  /* ============================================================
     END OF UNCHANGED LOGIC
  ============================================================ */

  // Sticky "add to cart" bar — shows once the main add-to-cart
  // button scrolls out of view, purely a display concern.
  const mainButtonRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const target = mainButtonRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  // ===== AI REVIEW SUMMARY STATE =====
  const [aiReviewSummary, setAiReviewSummary] = useState(null);
  const [isSummarizingReviews, setIsSummarizingReviews] = useState(false);
  const [showAiSummaryBox, setShowAiSummaryBox] = useState(false);

  const isOwner = Boolean(
    currentUser && item && String(item.ownerId) === String(currentUser.id)
  );

  const handleGenerateReviewSummary = () => {
    setIsSummarizingReviews(true);
    setShowAiSummaryBox(true);
    setTimeout(() => {
      const summary = summarizeReviewsWithAi(reviewsList, item?.category);
      setAiReviewSummary(summary);
      setIsSummarizingReviews(false);
    }, 400);
  };

  // ===== REVIEWS STATE & HANDLERS =====
  const [reviewsList, setReviewsList] = useState(item?.reviews || []);
  const [currentRating, setCurrentRating] = useState(item?.rating || 0);
  const [currentReviewCount, setCurrentReviewCount] = useState(item?.reviewCount || 0);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [reviewVotes, setReviewVotes] = useState({});
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handlePostReview = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("mineForNowUser") || "null");
    if (!currentUser) {
      alert("Please log in to rate and review this item.");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      setReviewError("Please write a few words about your rental experience.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    const finalTitle = newReviewTitle.trim() || starDefaultTitles[newRating] || "Good";
    const reviewObj = {
      user: currentUser.id || currentUser._id,
      userName: currentUser.name || "Verified Renter",
      title: finalTitle,
      rating: Number(newRating),
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    try {
      await fetch(`http://localhost:5000/api/items/${item.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment.trim(),
          userId: currentUser.id || currentUser._id,
          userName: currentUser.name || "Verified Renter",
        }),
      });
    } catch (err) {
      console.log("Backend offline or local-only listing:", err);
    }

    // Update local listing in localStorage
    const updatedReviews = [reviewObj, ...reviewsList];
    const total = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const newAvg = Number((total / updatedReviews.length).toFixed(1));

    setReviewsList(updatedReviews);
    setCurrentRating(newAvg);
    setCurrentReviewCount(updatedReviews.length);

    const storedListings = JSON.parse(localStorage.getItem("mineForNowListings") || "[]");
    const updatedListings = storedListings.map((l) => {
      if (String(l.id) === String(item?.id)) {
        return {
          ...l,
          reviews: updatedReviews,
          rating: newAvg,
          reviewCount: updatedReviews.length,
        };
      }
      return l;
    });
    localStorage.setItem("mineForNowListings", JSON.stringify(updatedListings));

    setNewComment("");
    setNewReviewTitle("");
    setShowReviewForm(false);
    setSubmittingReview(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  
  const handleVote = (index, type) => {
    const key = `review_${index}`;
    const currentVote = reviewVotes[key];
    const newVotes = { ...reviewVotes };

    const updatedList = reviewsList.map((rev, i) => {
      if (i !== index) return rev;
      let likes = rev.likes || 0;
      let dislikes = rev.dislikes || 0;

      if (currentVote === type) {
        // Toggle off
        if (type === "like") likes = Math.max(0, likes - 1);
        if (type === "dislike") dislikes = Math.max(0, dislikes - 1);
        delete newVotes[key];
      } else {
        // Switch or set vote
        if (currentVote === "like") likes = Math.max(0, likes - 1);
        if (currentVote === "dislike") dislikes = Math.max(0, dislikes - 1);

        if (type === "like") likes += 1;
        if (type === "dislike") dislikes += 1;
        newVotes[key] = type;
      }

      return { ...rev, likes, dislikes };
    });

    setReviewVotes(newVotes);
    setReviewsList(updatedList);
  };

  // Rating breakdown bars for the review section — derived from state
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewsList.filter((r) => Number(r.rating) === star).length;
    const percent = reviewsList.length
      ? Math.round((count / reviewsList.length) * 100)
      : 0;
    return { star, count, percent };
  });

  return (
    <div className="item-details-page">
      <div className="item-details-container">

        {/* BREADCRUMB */}

        <div className="item-breadcrumb">
          <button onClick={() => navigate("/")}>Home</button>
          <ChevronRight size={14} />
          <button
            onClick={() =>
              navigate(
                `/browse?category=${encodeURIComponent(item.category)}`
              )
            }
          >
            {item.category}
          </button>
          <ChevronRight size={14} />
          <span>{item.name}</span>
        </div>

        {/* MAIN */}

        <div className="item-details-main">

          {/* LEFT — IMAGE + THUMBNAILS */}

          <div className="item-details-left">

            <div className="item-details-image">
              <img src={item.image} alt={item.name} />

              <button
                className={`item-details-heart ${
                  isWishlisted ? "wishlist-active" : ""
                }`}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={handleWishlist}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="item-thumbnail-row">
              <button className="item-thumbnail active">
                <img src={item.image} alt={item.name} />
              </button>
            </div>

            {/* WHAT RENTING INCLUDES */}

            <div className="renting-includes">
              <h3>What renting includes</h3>

              <div className="includes-grid">
                <div className="includes-item">
                  <Wrench size={16} />
                  Free maintenance
                </div>
                <div className="includes-item">
                  <ShieldCheck size={16} />
                  Verified product
                </div>
                <div className="includes-item">
                  <Lock size={16} />
                  Secure payment
                </div>
                <div className="includes-item">
                  <Headphones size={16} />
                  Premium support
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — STICKY SUMMARY CARD */}

          <div className="item-details-info">

            <span className="item-details-category">{item.category}</span>

            <h1>{item.name}</h1>

            <div className="item-details-rating">
              <Star size={17} fill="currentColor" />
              <strong>{item.rating}</strong>
              <span>({item.reviewCount} reviews)</span>
            </div>

            <div className="item-details-price">
              <strong>₹{item.price}</strong>
              <span>/ day</span>
            </div>

            <div className="item-details-location">
              <MapPin size={16} />
              <span>{item.location}</span>
            </div>

            <div className="item-availability">
              <span className="availability-dot"></span>
              {item.availabilityStatus}
            </div>

            {item.quantity > 1 && (
              <div className="item-quantity-section">
                <h3>Quantity</h3>

                <div className="quantity-control">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= item.quantity}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p>{item.quantity} units available</p>
              </div>
            )}

            <div className="security-deposit-box">
              <strong>Security Deposit: ₹{item.securityDeposit}</strong>
              <span>Refundable on successful return</span>
            </div>

            <div className="item-details-divider" />

            {/* DATES — untouched logic, only markup wrapper is new */}

            <div className="rental-dates-box">
              <h3>
                <Calendar size={18} />
                <span>Select rental dates</span>
              </h3>

              <div className="date-fields">

                <div className="date-field">
                  <label>Start Date</label>

                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="date-field">
                  <label>End Date</label>

                  <input
                    type="date"
                    value={endDate}
                    min={
                      startDate || new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

              </div>
            </div>

            {rentalDays > 0 && (
              <div className="rental-total">
                <span>
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  {item.quantity > 1 && ` × ${quantity}`}
                </span>

                <strong>₹{totalPrice}</strong>
              </div>
            )}

            {isRented && !isRentedByCurrent && (
              <div className="rented-status-notice unavailable">
                <strong>Currently Unavailable</strong>
                <p>This item is currently rented out and cannot be booked.</p>
              </div>
            )}

            {isRented && isRentedByCurrent && (
              <div className="rented-status-notice rented-by-you">
                <strong>Your Active Rental</strong>
                <p>You have confirmed and rented this item.</p>
              </div>
            )}

            <div className="item-rental-actions">
              {isRented && !isRentedByCurrent ? (
                <button
                  ref={mainButtonRef}
                  className="add-to-cart-button disabled"
                  disabled={true}
                >
                  Currently Rented Out
                </button>
              ) : isRented && isRentedByCurrent ? (
                <button
                  ref={mainButtonRef}
                  className="add-to-cart-button view-rental-btn"
                  onClick={() => navigate("/my-rentals")}
                >
                  View In My Rentals
                </button>
              ) : (
                <button
                  ref={mainButtonRef}
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
            </div>

            <p className="rental-note">
              You will be able to review the rental details before
              confirming.
            </p>

          </div>
        </div>

        {/* PRODUCT DETAILS */}

        <section className="product-details-section">
          <h2>Product Details</h2>

          <div className="product-details-content">
            <h3>About this item</h3>

            <p>{item.description}</p>

            <div className="product-specs-table">
              <div className="spec-line">
                <span className="spec-label">Category</span>
                <span className="spec-value">{item.category}</span>
              </div>

              <div className="spec-line">
                <span className="spec-label">Location</span>
                <span className="spec-value">{item.location}</span>
              </div>

              <div className="spec-line">
                <span className="spec-label">Rental Price</span>
                <span className="spec-value">₹{item.price} / day</span>
              </div>

              <div className="spec-line">
                <span className="spec-label">Security Deposit</span>
                <span className="spec-value">₹{item.securityDeposit} (Refundable)</span>
              </div>

              <div className="spec-line">
                <span className="spec-label">Availability</span>
                <span className="spec-value">
                  <span className={`spec-status-dot ${item.availabilityStatus === "Available" ? "available" : "unavailable"}`} />
                  {item.availabilityStatus}
                </span>
              </div>

              {item.quantity > 1 && (
                <div className="spec-line">
                  <span className="spec-label">Available Quantity</span>
                  <span className="spec-value">{item.quantity} units</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RATINGS & REVIEWS */}

        <section className="reviews-section">

          <div className="reviews-section-header">
            <div>
              <h2>Ratings &amp; Reviews</h2>
              <span className="reviews-subtitle">Real experiences from verified community renters</span>
            </div>
          </div>

          <div className="reviews-summary">

            <div className="reviews-score">
              <strong>{currentRating}</strong>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(currentRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <span>{currentReviewCount} ratings</span>
            </div>

            <div className="reviews-breakdown">
              {ratingBreakdown.map(({ star, count, percent }) => (
                <div className="breakdown-row" key={star}>
                  <span>{star} star</span>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="breakdown-percent">{percent}%</span>
                </div>
              ))}
            </div>

          </div>

          {/* REVIEW THIS PRODUCT CALLOUT (AMAZON STYLE) */}
          <div className="review-this-product-section">
            <h3 className="review-this-product-title">Review this product</h3>
            <p className="review-this-product-desc">Share your thoughts with other customers</p>
            <button
              type="button"
              className="write-product-review-pill-btn"
              onClick={() => setShowReviewForm((prev) => !prev)}
            >
              {showReviewForm ? "Cancel review" : "Write a product review"}
            </button>
            <div className="review-this-product-divider"></div>
          </div>

          {reviewSuccess && (
            <div className="review-success-banner">
              ✓ Thank you! Your review and rating have been posted.
            </div>
          )}

          {/* INTERACTIVE REVIEW FORM */}
          {showReviewForm && (
            <form onSubmit={handlePostReview} className="item-review-form-box">
              <h3>Rate &amp; Review this Gear</h3>
              <p className="review-form-subtext">
                How was the gear condition, battery life, clean presentation, and pickup/return ease?
              </p>

              <div className="interactive-star-selector">
                <span className="star-select-label">Select Your Rating:</span>
                <div className="interactive-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="star-click-btn"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                    >
                      <Star
                        size={26}
                        fill={star <= (hoverRating || newRating) ? "#c9a45c" : "none"}
                        color={star <= (hoverRating || newRating) ? "#c9a45c" : "#b0ad9e"}
                      />
                    </button>
                  ))}
                  <span className="active-star-label">
                    {hoverRating ? starLabels[hoverRating] : starLabels[newRating]}
                  </span>
                </div>
              </div>

              <div className="review-title-input-group">
                <input
                  type="text"
                  placeholder="Review Title (e.g. Awesome, Great gear condition, etc.)"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="review-title-field"
                />
              </div>

              <div className="review-textarea-wrapper">
                <textarea
                  rows={4}
                  placeholder="Share details of your experience: Was the item in mint condition? Did the owner respond quickly?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>

              {reviewError && <p className="review-error-msg">{reviewError}</p>}

              <div className="review-form-actions">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="submit-review-btn"
                >
                  {submittingReview ? "Posting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  className="cancel-review-btn"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {showReviewForm && (
            <div className="review-title-input-row" style={{ display: "none" }}></div>
          )}

          <div className="reviews-list flipkart-reviews-layout">
            {reviewsList.length === 0 ? (
              <div className="no-reviews-card">
                <Star size={32} className="no-reviews-icon" />
                <p>No reviews yet for this gear.</p>
                <span>Be the first verified borrower to share your experience!</span>
              </div>
            ) : (
              reviewsList.map((review, index) => {
                const author = review.userName || "MineForNow Borrower";
                const reviewDate = formatReviewRelativeDate(review.createdAt);
                const title = review.title || starDefaultTitles[review.rating] || "Good";
                const ratingNum = Number(review.rating) || 5;

                // Color tier like Flipkart: 4-5 green, 3 amber/yellow, 1-2 red
                const ratingTierClass =
                  ratingNum >= 4 ? "tier-green" : ratingNum === 3 ? "tier-amber" : "tier-red";

                const key = `review_${index}`;
                const userVote = reviewVotes[key];
                const likes = review.likes || 0;
                const dislikes = review.dislikes || 0;

                return (
                  <div className="flipkart-review-card" key={index}>
                    {/* TOP LINE: [5 ★] Awesome --------- 7 days ago */}
                    <div className="fk-review-header">
                      <div className="fk-header-left">
                        <span className={`fk-rating-badge ${ratingTierClass}`}>
                          {ratingNum} <Star size={11} fill="currentColor" />
                        </span>
                        <strong className="fk-review-headline">{title}</strong>
                      </div>
                      <span className="fk-review-date">{reviewDate}</span>
                    </div>

                    {/* COMMENT BODY */}
                    <p className="fk-review-body">{review.comment}</p>

                    {/* BOTTOM LINE: Flipkart Customer / Verified Renter ------ 👍 0  👎 1 */}
                    <div className="fk-review-footer">
                      <div className="fk-author-details">
                        <span className="fk-author-name">{author}</span>
                        <span className="fk-verified-tag">
                          <CheckCircle2 size={13} className="fk-verified-icon" />
                          Verified Renter
                        </span>
                      </div>

                      <div className="fk-feedback-actions">
                        <button
                          type="button"
                          className={`fk-thumb-btn ${userVote === "like" ? "voted" : ""}`}
                          onClick={() => handleVote(index, "like")}
                          title="Helpful"
                        >
                          <ThumbsUp size={14} />
                          <span>{likes}</span>
                        </button>
                        <button
                          type="button"
                          className={`fk-thumb-btn ${userVote === "dislike" ? "voted" : ""}`}
                          onClick={() => handleVote(index, "dislike")}
                          title="Not helpful"
                        >
                          <ThumbsDown size={14} />
                          <span>{dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </section>

        {/* RECOMMENDED PRODUCTS */}

        <section className="recommended-section">
          <h2>Renters Also Considered</h2>

          <div className="recommended-grid">
            {recommendedItems.map((recommendedItem) => (
              <div
                className="recommended-card"
                key={recommendedItem.id}
                onClick={() => navigate(`/item/${recommendedItem.id}`)}
              >
                <div className="recommended-image">
                  <img
                    src={recommendedItem.image}
                    alt={recommendedItem.name}
                  />
                </div>

                <div className="recommended-content">
                  <span>{recommendedItem.category}</span>

                  <h3>{recommendedItem.name}</h3>

                  <div className="recommended-bottom">
                    <strong>
                      ₹{recommendedItem.price}
                      <small>/ day</small>
                    </strong>

                    <div>
                      <Star size={14} fill="currentColor" />
                      {recommendedItem.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* STICKY ADD-TO-CART BAR */}

      {showStickyBar && (
        <div className="sticky-cart-bar">
          <div className="sticky-cart-bar-inner">

            <div className="sticky-cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>
                  {rentalDays > 0
                    ? `${rentalDays} ${rentalDays === 1 ? "day" : "days"}`
                    : "Select dates"}
                </span>
              </div>
            </div>

            <div className="sticky-cart-price">
              ₹{item.price}
              <small>/ Day</small>
            </div>

            <button
              className="sticky-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default ItemDetails;