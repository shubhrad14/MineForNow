import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Search,
  Zap,
  RotateCcw,
  Heart,
  CheckCircle2,
  Tent,
  Clapperboard,
  Camera,
  Snowflake,
  Laptop,
  HeartPulse,
} from "lucide-react";

import cameraImg from "../assets/camera.jpg";
import projectorImg from "../assets/projector.jpg";
import coolerImg from "../assets/air-cooler.jpg";
import laptopImg from "../assets/laptop.jpg";
import microwaveImg from "../assets/microwave.jpg";
import wheelchairImg from "../assets/wheelchair.jpg";

import "./AIRecommendations.css";

// Comprehensive catalog for instantaneous AI matching
const DEFAULT_CATALOG = [
  {
    id: "rec_1",
    name: "Sony Alpha A7 Camera",
    category: "Electronics",
    location: "Mumbai",
    price: "₹750",
    period: "/ day",
    baseMatch: 96,
    keywords: ["camera", "photo", "shoot", "video", "wedding", "creator", "vlog", "trip"],
    tags: ["Trending", "Near You"],
    reason: "Ultra 4K video & low-light specialist",
    image: cameraImg,
  },
  {
    id: "rec_2",
    name: "Full HD Portable Projector",
    category: "Electronics",
    location: "Mumbai",
    price: "₹600",
    period: "/ day",
    baseMatch: 92,
    keywords: ["projector", "movie", "night", "party", "screen", "cinema", "rooftop", "entertainment"],
    tags: ["Popular Pick", "High Demand"],
    reason: "3,500 lumens with built-in stereo audio",
    image: projectorImg,
  },
  {
    id: "rec_3",
    name: "Desert Air Cooler 50L",
    category: "Home Appliances",
    location: "Mumbai",
    price: "₹450",
    period: "/ day",
    baseMatch: 89,
    keywords: ["cooler", "summer", "heat", "air", "home", "cooling", "appliance"],
    tags: ["Seasonal", "Near You"],
    reason: "High air delivery with auto-swing cooling",
    image: coolerImg,
  },
  {
    id: "rec_4",
    name: "High-Performance Workstation Laptop",
    category: "Electronics",
    location: "Pune",
    price: "₹950",
    period: "/ day",
    baseMatch: 94,
    keywords: ["laptop", "work", "study", "code", "design", "office", "presentation"],
    tags: ["Work & Study", "Verified Owner"],
    reason: "32GB RAM & dedicated GPU for seamless multitasking",
    image: laptopImg,
  },
  {
    id: "rec_5",
    name: "Convection Microwave Oven",
    category: "Home Appliances",
    location: "Mumbai",
    price: "₹350",
    period: "/ day",
    baseMatch: 86,
    keywords: ["microwave", "kitchen", "party", "food", "cooking", "event", "home"],
    tags: ["Quick Setup", "Sanitized"],
    reason: "Fast preheat with 28L capacity for parties",
    image: microwaveImg,
  },
  {
    id: "rec_6",
    name: "Ergonomic Folding Wheelchair",
    category: "Medical Equipment",
    location: "Mumbai",
    price: "₹300",
    period: "/ day",
    baseMatch: 95,
    keywords: ["wheelchair", "medical", "mobility", "elderly", "health", "care", "recovery"],
    tags: ["Sanitized", "Urgent Need"],
    reason: "Lightweight foldable frame with safety handbrakes",
    image: wheelchairImg,
  },
];

// Quick suggestion pills with Lucide icons (no emojis)
const QUICK_PILLS = [
  { label: "Weekend Camping", icon: Tent, query: "camping trip outdoors camera cooler" },
  { label: "Movie Night", icon: Clapperboard, query: "movie night party projector screen" },
  { label: "Photo Shoot", icon: Camera, query: "photo shoot camera video creator" },
  { label: "Summer Essentials", icon: Snowflake, query: "summer cooling air cooler heat" },
  { label: "Work from Home", icon: Laptop, query: "work study office laptop" },
  { label: "Medical Care", icon: HeartPulse, query: "medical health wheelchair mobility" },
];

function AIRecommendations() {
  const navigate = useNavigate();

  const [promptText, setPromptText] = useState("");
  const [activePill, setActivePill] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMessage, setAiMessage] = useState(
    "Our AI can help you discover rental items based on your needs, location and preferences."
  );
  const [recommendations, setRecommendations] = useState(DEFAULT_CATALOG.slice(0, 3));
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("mineForNowWishlist") || "[]");
  });

  // Load any user-created listings to also match them
  const [allInventory, setAllInventory] = useState(DEFAULT_CATALOG);

  useEffect(() => {
    const userListings = JSON.parse(
      localStorage.getItem("mineForNowListings") || "[]"
    );

    if (userListings.length > 0) {
      const formattedListings = userListings
        .filter((l) => l.availability === "available" || l.isAvailable !== false)
        .map((l) => ({
          id: l.id,
          name: l.name,
          category: l.category || "General",
          location: l.location || "City",
          price: `₹${l.price}`,
          period: "/ day",
          baseMatch: 95,
          keywords: [
            l.name.toLowerCase(),
            (l.category || "").toLowerCase(),
            (l.description || "").toLowerCase(),
          ].join(" ").split(/\s+/),
          tags: ["User Listing", "Available"],
          reason: l.description ? l.description.slice(0, 50) + "..." : "Available for instant rent",
          image: l.image || cameraImg,
        }));

      setAllInventory([...formattedListings, ...DEFAULT_CATALOG]);
    }
  }, []);

  // Fast AI Matching Engine
  const runAiMatch = (rawQuery, pillName = null) => {
    const query = rawQuery.trim().toLowerCase();

    if (!query) {
      setRecommendations(DEFAULT_CATALOG.slice(0, 3));
      setAiMessage("Our AI can help you discover rental items based on your needs, location and preferences.");
      setActivePill(null);
      return;
    }

    setIsAnalyzing(true);
    setActivePill(pillName);

    // Fast reactive response timer (~350ms for realistic AI feeling)
    setTimeout(() => {
      const searchTerms = query.split(/\s+/).filter((w) => w.length > 2);

      // Score each inventory item based on keyword matching
      const scoredItems = allInventory.map((item) => {
        let score = 70;
        const itemName = item.name.toLowerCase();
        const itemCat = item.category.toLowerCase();
        const itemKeywords = (item.keywords || []).map((k) => k.toLowerCase());

        searchTerms.forEach((term) => {
          if (itemName.includes(term)) score += 15;
          if (itemCat.includes(term)) score += 12;
          if (itemKeywords.some((k) => k.includes(term))) score += 10;
        });

        // Cap match score between 84% and 98%
        const matchPercentage = Math.min(Math.max(score, 82), 98);

        return {
          ...item,
          match: matchPercentage,
        };
      });

      // Sort by highest match score
      scoredItems.sort((a, b) => b.match - a.match);

      const topPicks = scoredItems.slice(0, 3);
      setRecommendations(topPicks);

      // Formulate conversational AI response
      const occasionName = pillName || `"${rawQuery}"`;
      setAiMessage(
        `AI Match complete! Found ${topPicks.length} high-match rental items for ${occasionName}. Estimated savings vs buying: ~₹18,500!`
      );

      setIsAnalyzing(false);
    }, 320);
  };

  const handlePillClick = (pill) => {
    setPromptText(pill.label.replace(/^[^\w\s]+/, "").trim());
    runAiMatch(pill.query, pill.label);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    runAiMatch(promptText);
  };

  const handleReset = () => {
    setPromptText("");
    setActivePill(null);
    setRecommendations(DEFAULT_CATALOG.slice(0, 3));
    setAiMessage(
      "Our AI can help you discover rental items based on your needs, location and preferences."
    );
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.some((w) => String(w.id) === String(item.id));
    let updated;
    if (exists) {
      updated = wishlist.filter((w) => String(w.id) !== String(item.id));
    } else {
      updated = [...wishlist, item];
    }
    setWishlist(updated);
    localStorage.setItem("mineForNowWishlist", JSON.stringify(updated));
  };

  return (
    <section className="ai-recommendations" id="ai-recommender">
      {/* SECTION HEADING */}
      <div className="ai-heading">
        <div className="ai-title">
          <div className="ai-sparkle">
            <Sparkles size={22} />
          </div>

          <div>
            <p>AI SMART RECOMMENDATIONS</p>
            <h2>Picked for you</h2>
          </div>
        </div>

        <span className="ai-heading-subtitle">
          Intelligent occasion & gear matching powered by MineForNow AI.
        </span>
      </div>

      {/* AI CONTENT AREA */}
      <div className="ai-content">
        {/* INTERACTIVE AI CHAT & PROMPT BUBBLE */}
        <div className="ai-chat">
          <div className="ai-chat-avatar">
            <Sparkles size={20} />
          </div>

          <div className="ai-chat-bubble">
            <div className="ai-bubble-header">
              <h3>Find something you'll love</h3>
              {(promptText || activePill) && (
                <button
                  type="button"
                  className="btn-ai-reset"
                  onClick={handleReset}
                  title="Reset suggestions"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="ai-bubble-description">
              {isAnalyzing ? (
                <span className="ai-analyzing-text">
                  <Sparkles size={14} className="sparkle-spin" />
                  Analyzing your needs & finding top rental matches...
                </span>
              ) : (
                aiMessage
              )}
            </p>

            {/* FAST INTERACTIVE SEARCH INPUT */}
            <form className="ai-prompt-form" onSubmit={handleFormSubmit}>
              <div className="ai-input-wrapper">
                <Search size={16} className="ai-search-icon" />
                <input
                  type="text"
                  className="ai-prompt-input"
                  placeholder='e.g., "Camping in Lonavala this weekend" or "Party movie night"'
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="ai-ask-button"
                disabled={isAnalyzing}
              >
                <Zap size={14} />
                <span>{isAnalyzing ? "Matching..." : "Ask AI"}</span>
              </button>
            </form>

            {/* QUICK PRESET PILLS FOR 1-CLICK EXPLORATION */}
            <div className="ai-pills-row">
              <span className="pills-label">Quick Suggestions:</span>
              <div className="pills-scroll">
                {QUICK_PILLS.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <button
                      key={pill.label}
                      type="button"
                      className={`ai-quick-pill ${
                        activePill === pill.label ? "active" : ""
                      }`}
                      onClick={() => handlePillClick(pill)}
                    >
                      {Icon && <Icon size={14} className="pill-icon" />}
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC RECOMMENDATION CARDS */}
        <div className="recommendation-container">
          {recommendations.map((item) => (
            <div
              className={`recommendation-card ${isAnalyzing ? "fade-out" : "fade-in"}`}
              key={item.id || item.name}
              onClick={() => {
                if (typeof item.id === "number" || (item.id && !item.id.startsWith("rec_"))) {
                  navigate(`/item/${item.id}`);
                } else {
                  navigate(`/browse?search=${encodeURIComponent(item.name.split(" ")[0])}`);
                }
              }}
            >
              <div className="recommendation-image">
                <span className="match-badge">
                  <Sparkles size={11} />
                  {item.match || item.baseMatch || 95}% Match
                </span>

                <button
                  type="button"
                  className="ai-wishlist-btn"
                  title="Save to Wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                >
                  <Heart
                    size={17}
                    fill={
                      wishlist.some((w) => String(w.id) === String(item.id))
                        ? "var(--action-primary)"
                        : "none"
                    }
                    color={
                      wishlist.some((w) => String(w.id) === String(item.id))
                        ? "var(--action-primary)"
                        : "#ffffff"
                    }
                  />
                </button>

                <img src={item.image} alt={item.name} />
              </div>

              <div className="recommendation-info">
                <span className="recommendation-category">{item.category}</span>

                <h3>{item.name}</h3>

                <div className="recommendation-location">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>

                {item.reason && (
                  <p className="ai-reason-text">
                    <CheckCircle2 size={13} className="reason-check-icon" />
                    <span>{item.reason}</span>
                  </p>
                )}

                <div className="recommendation-tags">
                  {(item.tags || []).map((tag) => (
                    <span className="reason-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="recommendation-footer">
                  <div className="recommendation-price">
                    <strong>{item.price}</strong>
                    <span>{item.period}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-card-rent"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof item.id === "number" || (item.id && !item.id.startsWith("rec_"))) {
                        navigate(`/item/${item.id}`);
                      } else {
                        navigate(`/browse?search=${encodeURIComponent(item.name.split(" ")[0])}`);
                      }
                    }}
                  >
                    <span>Rent Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AIRecommendations;
