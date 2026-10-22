import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Heart,
  X,
} from "lucide-react";

import "./Browse.css";


// Indian Metro City aliases for intelligent location matching
const CITY_ALIASES = {
  "mumbai": ["mumbai", "bombay", "cotten green", "cotton green", "bandra", "andheri", "juhu", "dadar", "thane", "navi mumbai", "powai", "kurla", "colaba", "worli"],
  "pune": ["pune", "kothrud", "viman nagar", "hinjewadi", "baner", "wakad", "hadapsar", "shivaji nagar", "aundh", "camp"],
  "delhi": ["delhi", "new delhi", "connaught place", "hauz khas", "dwarka", "saket", "rohini", "karol bagh", "lajpat nagar", "noida", "gurgaon"],
  "bengaluru": ["bengaluru", "bangalore", "koramangala", "indiranagar", "whitefield", "hsr layout", "electronic city", "jayanagar", "malleswaram"],
  "gurgaon": ["gurgaon", "gurugram", "cyber hub", "dlf", "sohna road", "golf course road"],
  "noida": ["noida", "greater noida", "sector 18", "sector 62"],
  "hyderabad": ["hyderabad", "hitec city", "gachibowli", "jubilee hills", "banjara hills", "madhapur", "secunderabad"],
};

export const isLocationMatch = (itemLocation, filterLocation) => {
  if (!filterLocation || filterLocation.trim() === "") return true;
  if (!itemLocation) return false;

  const normItem = itemLocation.trim().toLowerCase();
  const normFilter = filterLocation.trim().toLowerCase();

  if (normItem.includes(normFilter) || normFilter.includes(normItem)) {
    return true;
  }

  for (const [cityKey, aliases] of Object.entries(CITY_ALIASES)) {
    const filterMatches = normFilter.includes(cityKey) || aliases.some((a) => normFilter.includes(a));
    if (filterMatches) {
      const itemMatches = normItem.includes(cityKey) || aliases.some((a) => normItem.includes(a));
      if (itemMatches) return true;
    }
  }

  return false;
};

// Default high-quality marketplace listings distributed across cities
const DEFAULT_MARKETPLACE_LISTINGS = [
  {
    id: "cat_mum_1",
    name: "Sony Alpha A7 Camera",
    category: "Electronics",
    location: "Mumbai",
    price: 750,
    securityDeposit: 2000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/camera.jpg",
    description: "Full-frame mirrorless camera with 28-70mm lens. Pristine condition with charger and extra battery.",
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "cat_mum_2",
    name: "Desert Air Cooler 50L",
    category: "Home Appliances",
    location: "Mumbai",
    price: 450,
    securityDeposit: 1000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/air-cooler.jpg",
    description: "Powerful 50-liter desert air cooler with high air delivery and honeycomb cooling pads.",
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "cat_mum_3",
    name: "Ergonomic Folding Wheelchair",
    category: "Medical Equipment",
    location: "Mumbai",
    price: 350,
    securityDeposit: 800,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/wheelchair.jpg",
    description: "Lightweight foldable wheelchair with padded armrests, footrests, and safety handbrakes.",
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "cat_pun_1",
    name: "High-Performance Workstation Laptop",
    category: "Electronics",
    location: "Pune",
    price: 950,
    securityDeposit: 2500,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/laptop.jpg",
    description: "Powerful 15-inch laptop with 32GB RAM, i7 processor, and dedicated GPU for development & rendering.",
    rating: 4.8,
    reviewCount: 11,
  },
  {
    id: "cat_pun_2",
    name: "4-Person Waterproof Camping Tent",
    category: "Camping & Trips",
    location: "Pune",
    price: 450,
    securityDeposit: 1000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/jeshoots-com-eCktzGjC-iU-unsplash.jpg",
    description: "Easy pop-up 4-person waterproof tent with ground sheet and rainfly. Perfect for Lonavala and Pawna trips.",
    rating: 4.9,
    reviewCount: 16,
  },
  {
    id: "cat_del_1",
    name: "Full HD Portable Cinema Projector",
    category: "Electronics",
    location: "Delhi",
    price: 600,
    securityDeposit: 1500,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/projector.jpg",
    description: "3,500 lumens cinema projector with HDMI and built-in stereo audio for rooftop movies and events.",
    rating: 4.7,
    reviewCount: 8,
  },
  {
    id: "cat_del_2",
    name: "Convection Microwave Oven 28L",
    category: "Home Appliances",
    location: "Delhi",
    price: 380,
    securityDeposit: 800,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/microwave.jpg",
    description: "Clean, sanitized 28L microwave oven with grill and auto-cook menus. Perfect for temporary stay.",
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: "cat_blr_1",
    name: "PlayStation 5 + 2 Controllers",
    category: "Gaming",
    location: "Bengaluru",
    price: 750,
    securityDeposit: 2500,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/Search2.png",
    description: "PS5 disc edition with 2 wireless controllers and top titles pre-installed for weekend gaming sessions.",
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "cat_blr_2",
    name: "Apple MacBook Pro 16-inch M2 Max",
    category: "Electronics",
    location: "Bengaluru",
    price: 1100,
    securityDeposit: 3000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/laptop.jpg",
    description: "Apple MacBook Pro 16-inch with Apple Silicon M2 Max, 32GB unified memory for creative professionals.",
    rating: 5.0,
    reviewCount: 15,
  },
  {
    id: "cat_gur_1",
    name: "DJI Mavic Mini 3 Pro Drone Kit",
    category: "Electronics",
    location: "Gurgaon",
    price: 950,
    securityDeposit: 2500,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/cam1.png",
    description: "Sub-249g lightweight 4K HDR drone with fly more combo (3 batteries, charging hub, remote).",
    rating: 4.9,
    reviewCount: 7,
  },
  {
    id: "cat_hyd_1",
    name: "JBL PartyBox 310 Bluetooth Speaker",
    category: "Party & Celebration",
    location: "Hyderabad",
    price: 850,
    securityDeposit: 2000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/Search3.png",
    description: "240W powerful party sound with built-in light show, mic input, and 18-hour battery.",
    rating: 4.8,
    reviewCount: 19,
  },
  {
    id: "cat_noi_1",
    name: "Oxygen Concentrator 5L Medical Certified",
    category: "Medical Equipment",
    location: "Noida",
    price: 650,
    securityDeposit: 2000,
    availability: "available",
    isAvailable: true,
    image: "/src/assets/wheelchair.jpg",
    description: "Medical-grade 5L oxygen concentrator with dual flow and purity indicator. Cleaned and sanitized.",
    rating: 5.0,
    reviewCount: 10,
  },
];

function Browse() {
  const currentUser = JSON.parse(
    localStorage.getItem("mineForNowUser") || "null"
  );
  const [items, setItems] = useState(() => {
    const savedListings = JSON.parse(
      localStorage.getItem("mineForNowListings") || "[]"
    );

    // Merge user listings and default catalog without duplicate IDs
    const userIds = new Set(savedListings.map((item) => String(item.id)));
    const merged = [
      ...savedListings,
      ...DEFAULT_MARKETPLACE_LISTINGS.filter((item) => !userIds.has(String(item.id))),
    ];

    return merged.map((item) => ({
      ...item,
      price: Number(item.price),
      period: "day",
      image: item.image || "/placeholder-item.png",
      occasions: item.occasions || [],
    }));
  });

  // All categories shown in the filter sidebar — kept in one place so
  // adding a new category later only means editing this list.
  const allCategories = [
    "Home Appliances",
    "Electronics",
    "Medical Equipment",
    "Gaming",
    "Party",
    "Weekend Camping & Road Trips",
    "Work & Study",
  ];

  const navigate = useNavigate();

  // Search
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Occasion now lives in state (seeded from the URL) instead of being
  // read fresh from searchParams every render — this is what makes it
  // clearable via "Clear All Filters".
  const [occasion, setOccasion] = useState(
    searchParams.get("occasion") || ""
  );

  // Category
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const category = searchParams.get("category");
    return category ? [category] : [];
  });

  // Location
  const [location, setLocation] = useState("");

  // Price
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Availability
  const [availableOnly, setAvailableOnly] = useState(false);

  // Sort
  const [sortOption, setSortOption] = useState("recommended");

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(
      localStorage.getItem("mineForNowWishlist") || "[]"
    );
  });

  // Category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  // Handle Wishlist
  const handleWishlist = (item) => {
    setWishlist((current) => {

      const exists = current.some(
        (wishlistItem) => wishlistItem.id === item.id
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = current.filter(
          (wishlistItem) => wishlistItem.id !== item.id
        );
      } else {
        updatedWishlist = [...current, item];
      }

      localStorage.setItem(
        "mineForNowWishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  // Clear all filters — now also clears the occasion filter and
  // wipes the URL query params, so a refresh doesn't bring old
  // filters back.
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
    setSortOption("recommended");
    setOccasion("");
    setSearchParams({});
  };

  // Filtering
  let filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOccasion =
      occasion === "" || item.occasions?.includes(occasion);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    const matchesLocation = isLocationMatch(item.location, location);

    const matchesMinPrice =
      minPrice === "" || item.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || item.price <= Number(maxPrice);

    // Available items are visible to everyone. Unavailable / rented items are ONLY visible to the user who ordered it!
    const isAvailable = item.availability === "available" || item.isAvailable === true;
    const isRentedByCurrent = Boolean(
      currentUser && (
        (item.rentedBy && (item.rentedBy === currentUser.id || item.rentedBy === currentUser.email)) ||
        (item.renterName && currentUser.name && item.renterName === currentUser.name)
      )
    );
    const matchesAvailability = isAvailable || isRentedByCurrent;
    return (
      matchesSearch &&
      matchesOccasion &&
      matchesCategory &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesAvailability
    );
  });

  // Sorting — added real logic for "Newest" (sorts by id descending,
  // treating higher id as more recently added).
  if (sortOption === "lowToHigh") {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  }

  if (sortOption === "highToLow") {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  }

  if (sortOption === "newest") {
    filteredItems = [...filteredItems].sort((a, b) => b.id - a.id);
  }

  // Active filter chips — lets the user see and remove filters one at a time.
  const activeChips = [];

  if (occasion) {
    activeChips.push({
      label: `Occasion: ${occasion}`,
      onRemove: () => {
        setOccasion("");
        const params = new URLSearchParams(searchParams);
        params.delete("occasion");
        setSearchParams(params);
      },
    });
  }

  selectedCategories.forEach((cat) => {
    activeChips.push({
      label: cat,
      onRemove: () => handleCategoryChange(cat),
    });
  });

  if (location.trim()) {
    activeChips.push({
      label: `Location: ${location}`,
      onRemove: () => setLocation(""),
    });
  }

  if (minPrice || maxPrice) {
    activeChips.push({
      label: `₹${minPrice || 0} – ₹${maxPrice || "∞"}`,
      onRemove: () => {
        setMinPrice("");
        setMaxPrice("");
      },
    });
  }

  if (availableOnly) {
    activeChips.push({
      label: "Available now",
      onRemove: () => setAvailableOnly(false),
    });
  }

  return (
    <div className="browse-page">

      {/* Page Header */}
      <section className="browse-header">
        <p>EXPLORE ITEMS</p>

        <h1>Find what you need.</h1>

        <span>Browse rental items available near you.</span>

        <div className="browse-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search for an item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="button">Search</button>
        </div>
      </section>


      {/* Main Browse Area */}
      <section className="browse-content">

        {/* Filters */}
        <aside className="filters">

          <div className="filters-title">
            <h3>Filters</h3>
            <SlidersHorizontal size={19} />
          </div>

          {/* Category */}
          <div className="filter-group">
            <h4>Category</h4>

            {allCategories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>

          {/* Location */}
          <div className="filter-group">
            <h4>Location</h4>

            <div className="location-filter">
              <MapPin size={16} />

              <input
                type="text"
                placeholder="Enter city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Availability */}
          <div className="filter-group">
            <h4>Availability</h4>

            <label>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available now
            </label>
          </div>

          {/* Price */}
          <div className="filter-group">
            <h4>Price per day</h4>

            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <span>—</span>

              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <h4>Sort By</h4>

            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>

        </aside>


        {/* Products */}
        <div className="browse-products">

          <div className="browse-products-top">

            <span>
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"} available
              {location.trim() ? ` in ${location}` : " across India"}
            </span>

          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="active-filters">
              {activeChips.map((chip) => (
                <button
                  className="filter-chip"
                  key={chip.label}
                  onClick={chip.onRemove}
                >
                  {chip.label}
                  <X size={13} />
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div className="browse-grid">

            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (

                <div className="browse-card" key={item.id}>

                  <div className="browse-image">

                    <button
                      className="browse-wishlist"
                      title={
                        wishlist.some(
                          (wishlistItem) => wishlistItem.id === item.id
                        )
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      onClick={() => handleWishlist(item)}
                    >
                      <Heart
                        size={19}
                        fill={
                          wishlist.some(
                            (wishlistItem) => wishlistItem.id === item.id
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <img src={item.image} alt={item.name} />

                  </div>

                  <div className="browse-info">

                    <div className="browse-category-wrap">
                      <span className="browse-category">
                        {item.category}
                      </span>
                      {Boolean(
                        item.rentedBy &&
                        currentUser &&
                        (item.rentedBy === currentUser.id ||
                          item.rentedBy === currentUser.email ||
                          item.renterName === currentUser.name)
                      ) && (
                        <span className="browse-rented-tag">Rented By You</span>
                      )}
                    </div>

                    <h3>{item.name}</h3>

                    <div className="browse-location">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>

                    <div className="browse-bottom">

                      <div className="browse-price">
                        <strong>₹{item.price}</strong>
                        <span>{item.period}</span>
                      </div>

                      <button
                        className="browse-details"
                        onClick={() => navigate(`/item/${item.id}`)}
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                </div>

              ))
            ) : (

              <div className="no-results">
                <h3>No items found</h3>
                <p>Try changing your search or filters.</p>
                <button onClick={clearFilters}>Clear Filters</button>
              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Browse;