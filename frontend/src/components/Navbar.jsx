import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  UserRound,
  ArrowUpRight,
  X,
  TrendingUp,
  Package,
  Boxes,
  LogOut,
  ChevronDown,
} from "lucide-react";

import "./Navbar.css";

function Navbar() {

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Keep currentUser synced across navigation and storage updates
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("mineForNowUser");
        if (!stored) {
          setCurrentUser(null);
          return;
        }
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed === "object" &&
          (parsed.email || parsed.id || parsed.name || parsed.firstName || parsed.token)
        ) {
          setCurrentUser(parsed);
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("userLogin", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userLogin", syncUser);
    };
  }, [location.pathname]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [locationOpen, setLocationOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("mineForNowLocation") || "Mumbai"
  );

  // ===== ACCOUNT / LOGIN STATE =====
  // Until a real backend exists, Login.jsx's handleLogin should save
  // something like:
  // localStorage.setItem("mineForNowUser", JSON.stringify({ name, email }));
  // on successful login — that's what makes this dropdown appear.

  const [accountOpen, setAccountOpen] = useState(false);
  const accountTimerRef = useRef(null);

  const handleAccountMouseEnter = () => {
    if (accountTimerRef.current) clearTimeout(accountTimerRef.current);
    setAccountOpen(true);
  };

  const handleAccountMouseLeave = () => {
    accountTimerRef.current = setTimeout(() => {
      setAccountOpen(false);
    }, 280);
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mineForNowUser");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed === "object" &&
        (parsed.email || parsed.id || parsed.name || parsed.firstName || parsed.token)
      ) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const isLoggedIn = Boolean(
    currentUser &&
    typeof currentUser === "object" &&
    (currentUser.email || currentUser.id || currentUser.name || currentUser.firstName || currentUser.token)
  );

  const items = [
    {
      id: 1,
      name: "Canon Camera",
      category: "Electronics",
      location: "Mumbai",
      price: 800,
      image: "/src/assets/camera.jpg",
    },
    {
      id: 2,
      name: "Laptop",
      category: "Electronics",
      location: "Mumbai",
      price: 700,
      image: "/src/assets/laptop.jpg",
    },
    {
      id: 3,
      name: "Projector",
      category: "Electronics",
      location: "Mumbai",
      price: 600,
      image: "/src/assets/projector.jpg",
    },
    {
      id: 4,
      name: "Wheelchair",
      category: "Medical Equipment",
      location: "Mumbai",
      price: 400,
      image: "/src/assets/wheelchair.jpg",
    },
    {
      id: 5,
      name: "Air Cooler",
      category: "Home Appliances",
      location: "Mumbai",
      price: 450,
      image: "/src/assets/air-cooler.jpg",
    },
    {
      id: 6,
      name: "Microwave",
      category: "Home Appliances",
      location: "Mumbai",
      price: 350,
      image: "/src/assets/microwave.jpg",
    },
  ];

  const trendingSearches = ["Camera", "Laptop", "Projector", "Sofa", "Table"];

  const filteredItems = searchText.trim()
    ? items.filter((item) => {
        const query = searchText.toLowerCase();

        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      })
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    setSearchOpen(false);

    navigate(`/browse?search=${encodeURIComponent(searchText.trim())}`);
  };

  const handleViewAll = () => {
    if (!searchText.trim()) return;

    setSearchOpen(false);

    navigate(`/browse?search=${encodeURIComponent(searchText.trim())}`);
  };

  const handleTrendingClick = (search) => {
    setSearchText(search);
  };

  const handleProductClick = (item) => {
    setSearchOpen(false);

    navigate(`/item/${item.id}`);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("mineForNowLocation", location);
    window.dispatchEvent(new CustomEvent("cityChange", { detail: location }));
    window.dispatchEvent(new Event("storage"));
    setLocationOpen(false);
  };
  

  // Clicking the profile icon: logged-out users go straight to Login;
  // logged-in users toggle the dropdown (hover also opens it, see JSX).
    // Clicking the profile icon: logged-out users go straight to Login;
  // logged-in users toggle the dropdown (hover also opens it, see JSX).
  const handleProfileClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    if (!isLoggedIn) {
      setAccountOpen(false);
      navigate("/login");
      return;
    }

    setAccountOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("mineForNowUser");
    setCurrentUser(null);
    setAccountOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }

      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">

      {/* Location */}

      <button className="location-btn" onClick={() => setLocationOpen(true)}>
        <MapPin size={17} strokeWidth={2} />
        <span>{selectedLocation}</span>
      </button>


      {/* Navigation */}

      <div className="nav-links">
        <a href="/">HOME</a>
        <a href="/browse">BROWSE</a>
      </div>


      {/* Logo */}

      <a href="/" className="logo">
        <span>Mine</span>
        <span>ForNow</span>
      </a>


      {/* Icons */}

      <div className="nav-icons">

        {/* SEARCH */}

        <button title="Search" onClick={() => setSearchOpen((prev) => !prev)}>
          <Search size={25} />
        </button>


        {/* WISHLIST */}

        <button title="Wishlist" onClick={() => navigate("/wishlist")}>
          <Heart size={25} />
        </button>


        {/* CART */}

        <button title="Cart" onClick={() => navigate("/cart")}>
          <ShoppingCart size={25} />
        </button>


        {/* PROFILE / ACCOUNT DROPDOWN */}

        <div
          className="account-wrapper"
          ref={accountRef}
          onMouseEnter={handleAccountMouseEnter}
          onMouseLeave={handleAccountMouseLeave}
        >

          <button
            title="Account"
            className="account-trigger"
            onClick={handleProfileClick}
          >
            <UserRound size={25} />

            {isLoggedIn && (
              <ChevronDown
                size={14}
                className={`account-chevron ${accountOpen ? "open" : ""}`}
              />
            )}
          </button>

          {/* Dropdown only ever renders for a logged-in user */}

          {isLoggedIn && accountOpen && (
            <div className="account-dropdown">

              <div className="account-dropdown-header">Your Account</div>

              <button
                className="account-dropdown-item"
                onClick={() => {
                  setAccountOpen(false);
                  navigate("/profile");
                }}
              >
                <UserRound size={18} />
                My Profile
              </button>

              <button
                className="account-dropdown-item"
                onClick={() => {
                  setAccountOpen(false);
                  navigate("/my-rentals");
                }}
              >
                <Package size={18} />
                My Rentals
              </button>

              <button
                className="account-dropdown-item"
                onClick={() => {
                  setAccountOpen(false);
                  navigate("/owner-dashboard");
                }}
              >
                <Boxes size={18} />
                My Listings
              </button>

              <button
                className="account-dropdown-item"
                onClick={() => {
                  setAccountOpen(false);
                  navigate("/wishlist");
                }}
              >
                <Heart size={18} />
                Wishlist
              </button>

              <div className="account-dropdown-divider"></div>

              <button
                className="account-dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>


      {/* SEARCH PANEL */}

      {searchOpen && (

        <div className="search-panel" ref={searchRef}>

          {/* SEARCH INPUT */}

          <form className="search-panel-input" onSubmit={handleSearchSubmit}>

            <Search size={21} />

            <input
              type="text"
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search sofa, chair, beds etc"
            />

            {searchText && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchText("")}
              >
                <X size={19} />
              </button>
            )}

          </form>


          {/* SEARCH CONTENT */}

          <div className="search-panel-content">

            {searchText.trim() ? (

              <>
                {/* RESULTS */}

                <div className="search-results-header">
                  <span>
                    Results for <strong>{searchText}</strong>
                  </span>
                </div>


                <div className="search-products-heading">

                  <span>
                    Products
                    <small>{filteredItems.length}</small>
                  </span>

                  <button onClick={handleViewAll}>
                    View all
                    <ArrowUpRight size={18} />
                  </button>

                </div>


                {filteredItems.length > 0 ? (

                  <div className="search-result-list">

                    {filteredItems.slice(0, 3).map((item) => (

                      <button
                        className="search-result-item"
                        key={item.id}
                        onClick={() => handleProductClick(item)}
                      >

                        <img src={item.image} alt={item.name} />

                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.category}</span>
                        </div>

                        <span className="search-result-price">
                          ₹{item.price}/day
                        </span>

                      </button>

                    ))}

                  </div>

                ) : (

                  <div className="search-no-results">
                    <div className="sad-icon">☹</div>
                    <p>Oops! We don't have any results for your query</p>
                  </div>

                )}

              </>

            ) : (

              <>
                {/* DEFAULT SEARCH PANEL */}

                <div className="search-results-header">
                  <span>Trending searches</span>
                </div>


                <div className="trending-searches">

                  {trendingSearches.map((search) => (

                    <button
                      key={search}
                      onClick={() => handleTrendingClick(search)}
                    >
                      <TrendingUp size={17} />
                      <span>{search}</span>
                    </button>

                  ))}

                </div>


                {/* POPULAR PRODUCTS */}

                <div className="popular-products-title">Popular products</div>


                <div className="popular-products">

                  {items.slice(0, 3).map((item) => (

                    <button
                      key={item.id}
                      onClick={() => handleProductClick(item)}
                    >
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </button>

                  ))}

                </div>

              </>

            )}

          </div>

        </div>

      )}


      {/* LOCATION POPUP */}

      {locationOpen && (
        <div
          className="location-overlay"
          onClick={() => setLocationOpen(false)}
        >

          <div className="location-modal" onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}

            <div className="location-modal-header">

              <div className="location-title-area">

                <div className="location-icon-box">
                  <MapPin size={25} />
                </div>

                <div>
                  <h2>Choose Your City</h2>

                  <p>
                    Select your city to explore rental products
                    and services available near you.
                  </p>
                </div>

              </div>

              <button
                className="location-close"
                onClick={() => setLocationOpen(false)}
              >
                <X size={22} />
              </button>

            </div>


            {/* CITIES */}

            <div className="city-grid">

              {[
                { name: "Delhi", image: "/src/assets/cities/delhi.jpg" },
                { name: "Gurgaon", image: "/src/assets/cities/gurgaon.jpg" },
                {
                  name: "Hyderabad",
                  image: "/src/assets/cities/hyderabad.jpg",
                },
                { name: "Noida", image: "/src/assets/cities/noida.jpg" },
                {
                  name: "Bengaluru",
                  image: "/src/assets/cities/bengaluru.jpg",
                },
                { name: "Pune", image: "/src/assets/cities/pune.jpg" },
                { name: "Mumbai", image: "/src/assets/cities/mumbai.jpg" },
              ].map((city) => (

                <button
                  key={city.name}
                  className={
                    selectedLocation === city.name
                      ? "city-card selected"
                      : "city-card"
                  }
                  onClick={() => handleLocationSelect(city.name)}
                >
                  <div className="city-icon-badge">
                    <MapPin size={24} />
                  </div>
                  <span>{city.name}</span>
                </button>

              ))}

            </div>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;