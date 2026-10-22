import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  TrendingUp,
  Check,
  ShieldCheck,
  Wand2,
  RefreshCw,
  BarChart3,
  Zap,
  Star,
  Crown,
  Layers,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { useState, useMemo } from "react";
import "./ListItem.css";

// Comprehensive market benchmarks across categories
const MARKET_BENCHMARKS = {
  "Electronics": {
    defaultMin: 500,
    defaultAvg: 750,
    defaultMax: 1200,
    depositMultiplier: 2.5,
    insightTip: "Electronics with pristine lenses/screens & complete cables book 40% faster.",
    sampleItems: [
      { name: "Sony Alpha A7 Camera", price: 750, deposit: 2000 },
      { name: "Full HD Portable Projector", price: 600, deposit: 1500 },
      { name: "DJI Mavic Mini Drone", price: 950, deposit: 2500 },
      { name: "Dell XPS 15 Workstation", price: 850, deposit: 2500 },
      { name: "GoPro Hero 11 Black", price: 550, deposit: 1500 },
    ],
  },
  "Home Appliances": {
    defaultMin: 280,
    defaultAvg: 420,
    defaultMax: 700,
    depositMultiplier: 2.0,
    insightTip: "Appliance renters prioritize clean, sanitized units ready for instant plug-and-play.",
    sampleItems: [
      { name: "Desert Air Cooler 50L", price: 450, deposit: 1000 },
      { name: "Convection Microwave Oven", price: 350, deposit: 800 },
      { name: "Dyson Vacuum Cleaner", price: 550, deposit: 1500 },
      { name: "Front Load Washing Machine", price: 600, deposit: 1500 },
      { name: "Philips Air Fryer XL", price: 300, deposit: 600 },
    ],
  },
  "Medical Equipment": {
    defaultMin: 250,
    defaultAvg: 380,
    defaultMax: 750,
    depositMultiplier: 2.0,
    insightTip: "Medical gear requires explicit mention of sanitization and verified working condition.",
    sampleItems: [
      { name: "Ergonomic Folding Wheelchair", price: 300, deposit: 800 },
      { name: "Oxygen Concentrator 5L", price: 650, deposit: 2000 },
      { name: "Hospital Fowler Bed", price: 500, deposit: 1500 },
      { name: "Walker with Wheels & Seat", price: 250, deposit: 500 },
    ],
  },
  "Gaming": {
    defaultMin: 450,
    defaultAvg: 700,
    defaultMax: 1100,
    depositMultiplier: 2.5,
    insightTip: "Bundling 2 controllers and popular pre-installed titles increases weekend bookings by 65%.",
    sampleItems: [
      { name: "PlayStation 5 + 2 Controllers", price: 750, deposit: 2500 },
      { name: "Meta Quest 3 VR Headset", price: 850, deposit: 2500 },
      { name: "Nintendo Switch OLED", price: 550, deposit: 1500 },
      { name: "Xbox Series X Console", price: 700, deposit: 2000 },
    ],
  },
  "Party & Celebration": {
    defaultMin: 400,
    defaultAvg: 650,
    defaultMax: 1200,
    depositMultiplier: 1.8,
    insightTip: "Party equipment with sound & lighting kits achieves premium weekend rental rates.",
    sampleItems: [
      { name: "JBL PartyBox 310 Speaker", price: 850, deposit: 2000 },
      { name: "Popcorn & Cotton Candy Maker", price: 500, deposit: 1000 },
      { name: "LED Ambient Stage Lights Kit", price: 450, deposit: 1000 },
      { name: "Karaoke Dual Mic & Mixer", price: 600, deposit: 1200 },
    ],
  },
  "Camping & Trips": {
    defaultMin: 350,
    defaultAvg: 550,
    defaultMax: 900,
    depositMultiplier: 2.0,
    insightTip: "Weatherproof condition and lightweight compact packing attract adventure travelers.",
    sampleItems: [
      { name: "Quechua 4-Person Waterproof Tent", price: 450, deposit: 1000 },
      { name: "Camping Stove & Cookware Set", price: 350, deposit: 700 },
      { name: "Trekking Backpack 65L + Poles", price: 400, deposit: 800 },
      { name: "Portable Power Station 300W", price: 750, deposit: 2000 },
    ],
  },
};

function ListItem() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [bookingType, setBookingType] = useState("instant");

  // AI Assistant states
  const [descTone, setDescTone] = useState("feature"); // "feature" | "crisp" | "pro"
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [priceApplied, setPriceApplied] = useState(false);
  const [activeTier, setActiveTier] = useState("optimal");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Pricing Intelligence Calculation
  const pricingIntelligence = useMemo(() => {
    if (!category) return null;

    const benchmark = MARKET_BENCHMARKS[category] || {
      defaultMin: 300,
      defaultAvg: 500,
      defaultMax: 850,
      depositMultiplier: 2.2,
      insightTip: "Setting a competitive daily rate builds positive renter reviews quickly.",
      sampleItems: [],
    };

    // Scan user's local stored listings for live market comparables
    let storedListings = [];
    try {
      storedListings = JSON.parse(
        localStorage.getItem("mineForNowListings") || "[]"
      );
    } catch (err) {
      storedListings = [];
    }

    const catStored = storedListings.filter(
      (item) =>
        item.category &&
        item.category.toLowerCase() === category.toLowerCase() &&
        Number(item.price) > 0
    );

    // Filter samples if user typed a specific item name
    const cleanName = itemName.toLowerCase().trim();
    let comparables = [...benchmark.sampleItems];
    if (cleanName) {
      const matched = benchmark.sampleItems.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanName) ||
          cleanName
            .split(/\s+/)
            .some((w) => w.length > 2 && s.name.toLowerCase().includes(w))
      );
      if (matched.length > 0) {
        comparables = matched;
      }
    }

    let min = benchmark.defaultMin;
    let avg = benchmark.defaultAvg;
    let max = benchmark.defaultMax;

    if (catStored.length >= 2) {
      const prices = catStored.map((i) => Number(i.price)).sort((a, b) => a - b);
      min = Math.min(min, prices[0]);
      max = Math.max(max, prices[prices.length - 1]);
      const storedAvg = Math.round(
        prices.reduce((sum, p) => sum + p, 0) / prices.length
      );
      avg = Math.round(storedAvg / 10) * 10;
    }

    const deposit = Math.round((avg * benchmark.depositMultiplier) / 100) * 100;

    return {
      min,
      optimal: avg,
      max,
      suggestedDeposit: deposit,
      comparables: comparables.slice(0, 4),
      insightTip: benchmark.insightTip,
      totalAnalyzed: benchmark.sampleItems.length + catStored.length,
    };
  }, [category, itemName]);

  // Apply a specific pricing tier
  const handleApplyTier = (tier, tierPrice) => {
    setActiveTier(tier);
    setPrice(String(tierPrice));
    if (pricingIntelligence) {
      const multiplier =
        tier === "min" ? 2.0 : tier === "max" ? 3.0 : 2.5;
      const calcDeposit = Math.round((tierPrice * multiplier) / 100) * 100;
      setSecurityDeposit(String(calcDeposit));
    }
    setPriceApplied(true);
    setTimeout(() => setPriceApplied(false), 2400);
  };

  // One-click apply optimal package
  const handleApplyOptimalPackage = () => {
    if (!pricingIntelligence) return;
    setActiveTier("optimal");
    setPrice(String(pricingIntelligence.optimal));
    setSecurityDeposit(String(pricingIntelligence.suggestedDeposit));
    setPriceApplied(true);
    setTimeout(() => setPriceApplied(false), 2500);
  };

  // AI Description Generator
  const handleGenerateDescription = (targetTone = descTone) => {
    if (!category) {
      alert("Please select a Category first to tailor your description.");
      return;
    }

    setIsGeneratingDesc(true);
    setDescTone(targetTone);

    setTimeout(() => {
      const name = itemName.trim() || `${category} Rental Gear`;

      let generated = "";
      if (targetTone === "crisp") {
        generated = `Pristine ${name} in excellent working order. Ready for immediate short-term rental with all standard accessories included. Thoroughly sanitized, tested, and available with hassle-free pickup or quick delivery.`;
      } else if (targetTone === "pro") {
        generated = `Professional-grade ${name} maintained strictly to manufacturer specifications. Fully inspected prior to every handover to guarantee flawless reliability. Ideal for creative projects, events, or studio sessions. Transparent deposit terms and prompt, verified coordination.`;
      } else {
        // feature-rich
        generated = `${name} in top-tier working condition, ideal for your upcoming project, event, or everyday requirement.

Key Highlights:
• 100% fully functional, cleaned, and performance-checked
• Includes all essential cables, accessories & carry case
• Flexible daily rental terms with sanitized handover
• Owner available for responsive communication and seamless pickup`;
      }

      setDescription(generated);
      setIsGeneratingDesc(false);
    }, 380);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const saveListing = (imageData) => {
      const currentUser = JSON.parse(
        localStorage.getItem("mineForNowUser") || "null"
      );

      if (!currentUser || !currentUser.id) {
        alert("Please log in before listing an item.");
        navigate("/login");
        return;
      }

      const isAvail = e.target.availability.value === "available";

      const listing = {
        id: Date.now(),
        ownerId: currentUser.id,
        name: itemName,
        category: category,
        price: Number(price),
        securityDeposit: Number(securityDeposit),
        description: description,
        location: e.target.location.value,
        availability: e.target.availability.value,
        isAvailable: isAvail,
        availabilityStatus: isAvail ? "Available" : "Unavailable",
        bookingType: bookingType,
        image: imageData,
      };

      const existingListings = JSON.parse(
        localStorage.getItem("mineForNowListings") || "[]"
      );

      existingListings.push(listing);

      localStorage.setItem(
        "mineForNowListings",
        JSON.stringify(existingListings)
      );

      alert("Item listed successfully!");
      navigate("/owner-dashboard");
    };

    if (images.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveListing(reader.result);
      };
      reader.readAsDataURL(images[0]);
    } else {
      saveListing(null);
    }
  };

  return (
    <div className="list-item-page">
      <div className="list-item-container">
        <button
          className="back-button"
          onClick={() => navigate("/owner-dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="list-item-heading">
          <p>RENT OUT YOUR ITEM</p>
          <h1>List an Item</h1>
          <span>
            Add your item details and start earning from what you already own.
          </span>
        </div>

        <form className="list-item-form" onSubmit={handleSubmit}>
          {/* BASIC DETAILS */}
          <section className="form-section">
            <h2>Basic Details</h2>

            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="e.g. Sony Alpha A7 Camera, Camping Tent, PS5"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Medical Equipment">Medical Equipment</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Party & Celebration">Party & Celebration</option>
                  <option value="Camping & Trips">Camping & Trips</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rental Price</label>
                <div className="price-field">
                  <span>₹</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="750"
                    min="1"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setActiveTier(null);
                    }}
                    required
                  />
                  <small>/ day</small>
                </div>
              </div>

              <div className="form-group">
                <label>Security Deposit</label>
                <div className="price-field">
                  <span>₹</span>
                  <input
                    type="number"
                    name="securityDeposit"
                    placeholder="2000"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* AI PRICE INTELLIGENCE & COMPARISON CARD */}
            {pricingIntelligence ? (
              <div className="ai-pricing-intelligence-card">
                <div className="ai-card-header">
                  <div className="ai-card-title-group">
                    <div className="ai-icon-badge">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="ai-card-title">AI Market Price Intelligence</h4>
                      <p className="ai-card-subtitle">
                        Benchmarked against {pricingIntelligence.totalAnalyzed}+ similar listings in <strong>{category}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="ai-live-badge">
                    <span className="ai-pulse-dot"></span>
                    Live Market Rates
                  </div>
                </div>

                {/* Similar items sample comparisons */}
                {pricingIntelligence.comparables.length > 0 && (
                  <div className="ai-comparables-section">
                    <span className="ai-comparables-label">
                      <BarChart3 size={13} /> Active Market Comparables:
                    </span>
                    <div className="ai-comparables-list">
                      {pricingIntelligence.comparables.map((item, idx) => (
                        <div key={idx} className="ai-comparable-chip">
                          <span className="comp-name">{item.name}</span>
                          <span className="comp-price">₹{item.price}/day</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Spectrum Bar (Clean, no overlapping tag) */}
                <div className="ai-spectrum-container">
                  <div className="ai-spectrum-labels">
                    <span className="spectrum-label-low">
                      Budget <strong>₹{pricingIntelligence.min}</strong>
                    </span>
                    <span className="spectrum-label-optimal">
                      <Star size={13} /> AI Optimal <strong>₹{pricingIntelligence.optimal}/day</strong>
                    </span>
                    <span className="spectrum-label-high">
                      Premium <strong>₹{pricingIntelligence.max}</strong>
                    </span>
                  </div>

                  <div className="ai-spectrum-track">
                    <div className="ai-spectrum-gradient"></div>
                    <div
                      className="ai-spectrum-optimal-pin"
                      style={{ left: "50%" }}
                      title={`AI Optimal Sweet Spot: ₹${pricingIntelligence.optimal}/day`}
                    ></div>
                  </div>

                  {/* Quick Selectable Tiers with Lucide Icons */}
                  <div className="ai-tier-buttons">
                    <button
                      type="button"
                      className={`ai-tier-btn ${
                        activeTier === "min" ? "active" : ""
                      }`}
                      onClick={() =>
                        handleApplyTier("min", pricingIntelligence.min)
                      }
                    >
                      <span className="tier-badge-label">
                        <Zap size={13} /> Fast Book
                      </span>
                      <strong>₹{pricingIntelligence.min}/day</strong>
                    </button>

                    <button
                      type="button"
                      className={`ai-tier-btn optimal ${
                        activeTier === "optimal" ? "active" : ""
                      }`}
                      onClick={() =>
                        handleApplyTier("optimal", pricingIntelligence.optimal)
                      }
                    >
                      <span className="best-tag">
                        <Star size={13} /> Recommended
                      </span>
                      <strong>₹{pricingIntelligence.optimal}/day</strong>
                    </button>

                    <button
                      type="button"
                      className={`ai-tier-btn ${
                        activeTier === "max" ? "active" : ""
                      }`}
                      onClick={() =>
                        handleApplyTier("max", pricingIntelligence.max)
                      }
                    >
                      <span className="tier-badge-label">
                        <Crown size={13} /> Premium
                      </span>
                      <strong>₹{pricingIntelligence.max}/day</strong>
                    </button>
                  </div>
                </div>

                {/* Insight Tip & Recommended Deposit */}
                <div className="ai-card-footer">
                  <div className="ai-footer-note">
                    <ShieldCheck size={16} className="ai-shield-icon" />
                    <span>
                      Suggested Deposit: <strong>₹{pricingIntelligence.suggestedDeposit}</strong> (protects gear without deterring renters). {pricingIntelligence.insightTip}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`ai-apply-package-btn ${
                      priceApplied ? "applied" : ""
                    }`}
                    onClick={handleApplyOptimalPackage}
                  >
                    {priceApplied ? (
                      <>
                        <Check size={16} />
                        Applied to Listing!
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Apply Optimal Pricing & Deposit
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ai-price-prompt">
                <Sparkles size={16} />
                <span>Select a <strong>Category</strong> above to unlock AI market price comparisons & optimal rate suggestions.</span>
              </div>
            )}

            {/* AI DESCRIPTION STUDIO */}
            <div className="form-group ai-description-group">
              <div className="description-label-row">
                <label>Item Description</label>

                {/* Tone Selector Pills with Lucide Icons */}
                <div className="ai-tone-chips">
                  <span className="tone-label">AI Tone:</span>
                  <button
                    type="button"
                    className={`tone-chip ${descTone === "feature" ? "active" : ""}`}
                    onClick={() => handleGenerateDescription("feature")}
                  >
                    <Layers size={13} /> Feature-Packed
                  </button>
                  <button
                    type="button"
                    className={`tone-chip ${descTone === "crisp" ? "active" : ""}`}
                    onClick={() => handleGenerateDescription("crisp")}
                  >
                    <Zap size={13} /> Short & Crisp
                  </button>
                  <button
                    type="button"
                    className={`tone-chip ${descTone === "pro" ? "active" : ""}`}
                    onClick={() => handleGenerateDescription("pro")}
                  >
                    <Briefcase size={13} /> Professional
                  </button>
                </div>
              </div>

              <div className="ai-desc-action-bar">
                <button
                  type="button"
                  className={`ai-generate-btn-primary ${
                    isGeneratingDesc ? "generating" : ""
                  }`}
                  onClick={() => handleGenerateDescription(descTone)}
                  disabled={isGeneratingDesc}
                >
                  {isGeneratingDesc ? (
                    <>
                      <RefreshCw size={14} className="spin-icon" />
                      Crafting Description...
                    </>
                  ) : description ? (
                    <>
                      <Wand2 size={14} />
                      Regenerate with AI
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate AI Description
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows="5"
                name="description"
                placeholder="Describe your item, its condition, included accessories and anything renters should know..."
                maxLength="450"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="char-counter-row">
                <span className="desc-hint">
                  <Lightbulb size={13} /> High-quality descriptions with bullet points increase booking conversions by 45%.
                </span>
                <span className="char-counter">{description.length}/450</span>
              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section className="form-section">
            <h2>Location</h2>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Mumbai, Pune, Bangalore"
                required
              />
            </div>
          </section>

          {/* IMAGES */}
          <section className="form-section">
            <h2>Item Images</h2>
            <p className="section-description">
              Add clear photos so renters can see the item before booking.
            </p>

            <label className="image-upload">
              <Upload size={28} />
              <strong>Upload Images</strong>
              <span>JPG, PNG or WEBP</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div className="image-preview" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeImage(index)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AVAILABILITY */}
          <section className="form-section">
            <h2>Availability & Booking</h2>

            <div className="form-group">
              <label>Availability</label>
              <select name="availability" required defaultValue="">
                <option value="" disabled>
                  Select availability
                </option>
                <option value="available">Available</option>
                <option value="unavailable">Currently Unavailable</option>
              </select>
            </div>

            <div className="booking-options">
              <label
                className={`booking-option ${
                  bookingType === "instant" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="bookingType"
                  value="instant"
                  checked={bookingType === "instant"}
                  onChange={() => setBookingType("instant")}
                />
                <div>
                  <strong>Instant Booking</strong>
                  <span>
                    Renters can book the item immediately after payment.
                  </span>
                </div>
              </label>

              <label
                className={`booking-option ${
                  bookingType === "approval" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="bookingType"
                  value="approval"
                  checked={bookingType === "approval"}
                  onChange={() => setBookingType("approval")}
                />
                <div>
                  <strong>Approval Required</strong>
                  <span>
                    Review and approve rental requests before payment.
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/owner-dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="publish-button">
              Publish Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ListItem;
