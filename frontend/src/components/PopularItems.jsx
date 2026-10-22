import { Heart, MapPin, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./PopularItems.css";

function PopularItems() {

  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("mineForNowLocation") || "Mumbai";
  });

  useEffect(() => {
    const handleCityChange = (e) => {
      const newCity = e?.detail || localStorage.getItem("mineForNowLocation") || "Mumbai";
      setSelectedCity(newCity);
    };
    window.addEventListener("cityChange", handleCityChange);
    window.addEventListener("storage", handleCityChange);
    return () => {
      window.removeEventListener("cityChange", handleCityChange);
      window.removeEventListener("storage", handleCityChange);
    };
  }, []);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(
      localStorage.getItem("mineForNowWishlist") || "[]"
    );
  });

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

  const items = [
    {
      id: 1,
      name: "Canon Camera",
      category: "Electronics",
      location: "Mumbai",
      price: "₹800",
      period: "/ day",
      rating: 4.8,
      image: "/src/assets/camera.jpg",
    },
    {
      id: 2,
      name: "Laptop",
      category: "Electronics",
      location: "Mumbai",
      price: "₹700",
      period: "/ day",
      rating: 4.6,
      image: "/src/assets/laptop.jpg",
    },
    {
      id: 3,
      name: "Projector",
      category: "Electronics",
      location: "Mumbai",
      price: "₹600",
      period: "/ day",
      rating: 4.7,
      image: "/src/assets/projector.jpg",
    },
    {
      id: 4,
      name: "Wheelchair",
      category: "Medical Equipment",
      location: "Mumbai",
      price: "₹400",
      period: "/ day",
      rating: 4.9,
      image: "/src/assets/wheelchair.jpg",
    },
    {
      id: 5,
      name: "Laptop",
      category: "Electronics",
      location: "Mumbai",
      price: "₹700",
      period: "/ day",
      rating: 4.6,
      image: "/src/assets/laptop.jpg",
    },
    {
      id: 6,
      name: "Projector",
      category: "Electronics",
      location: "Mumbai",
      price: "₹600",
      period: "/ day",
      rating: 4.7,
      image: "/src/assets/projector.jpg",
    },
    {
      id: 7,
      name: "Laptop",
      category: "Electronics",
      location: "Mumbai",
      price: "₹700",
      period: "/ day",
      rating: 4.6,
      image: "/src/assets/laptop.jpg",
    },
    {
      id: 8,
      name: "Projector",
      category: "Electronics",
      location: "Mumbai",
      price: "₹600",
      period: "/ day",
      rating: 4.7,
      image: "/src/assets/projector.jpg",
    },
  ];

  // ===== MOUSE DRAG-TO-SCROLL =====
  // Only treats it as a "drag" once the mouse actually moves past a small
  // threshold — a plain click (no movement) is left alone so buttons and
  // links inside the cards still work normally.

  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
      scrollRef.current.classList.add("dragging");
    }

    if (hasDragged.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollStart.current - walk * 1.2;
    }
  };

  const stopDragging = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("dragging");
  };

  // Always reset dragging on mouseup, even if the mouse was released
  // outside the row — otherwise it can get "stuck" thinking it's still dragging.
  useEffect(() => {
    window.addEventListener("mouseup", stopDragging);
    return () => window.removeEventListener("mouseup", stopDragging);
  }, []);

  // If the user actually dragged (moved the mouse), swallow the click that
  // the browser fires afterward so it doesn't accidentally open an item.
  const handleClickCapture = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  };

  // ===== KEYBOARD ARROW SCROLL =====
  // Only scrolls when the row itself is focused (click it once, then use arrows)
  // so this doesn't clash with the hero slider's global arrow-key listener.

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <section className="popular-items" id="popular">

      <div className="popular-heading">

        <div>
          <p>POPULAR NEAR YOU • {selectedCity.toUpperCase()}</p>
          <h2>Items people are renting</h2>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/browse")}
        >
          View All Items
          <ArrowRight size={17} />
        </button>

      </div>


      <div
        className="items-container"
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
      >

        {items.map((item) => (

          <div
            className="item-card"
            key={item.id}
          >

            <div className="item-image">

              <span className="availability-badge">Available Now</span>

              <button
                className="wishlist-btn"
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

              <img
                src={item.image}
                alt={item.name}
              />

            </div>


            <div className="item-info">

              <div className="item-info-top">
                <span className="item-category">
                  {item.category}
                </span>

                <div className="item-rating">
                  <Star size={13} fill="currentColor" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <h3>{item.name}</h3>

              <div className="item-location">
                <MapPin size={15} />
                <span>{item.location}</span>
              </div>


              <div className="item-bottom">

                <div className="item-price">
                  <strong>{item.price}</strong>
                  <span>{item.period}</span>
                </div>


                <button
                  className="details-btn"
                  onClick={() =>
                    navigate(`/item/${item.id}`)
                  }
                >
                  View Details
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default PopularItems;