import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, ArrowLeft, Trash2 } from "lucide-react";

import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(
      localStorage.getItem("mineForNowWishlist") || "[]"
    );

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "mineForNowWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

        {/* HEADER */}

        <button
          className="wishlist-back"
          onClick={() => navigate("/browse")}
        >
          <ArrowLeft size={17} />
          Back to Browse
        </button>

        <div className="wishlist-header">

          <div>
            <p className="wishlist-eyebrow">
              YOUR SAVED ITEMS
            </p>

            <h1>My Wishlist</h1>

            <p>
              Items you've saved for later.
            </p>
          </div>

          <div className="wishlist-count">
            {wishlist.length}{" "}
            {wishlist.length === 1 ? "item" : "items"}
          </div>

        </div>


        {/* EMPTY STATE */}

        {wishlist.length === 0 ? (

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <Heart size={30} />
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              Save items you love and find them here
              whenever you're ready to rent.
            </p>

            <button
              onClick={() => navigate("/browse")}
            >
              Explore Items
            </button>

          </div>

        ) : (

          /* WISHLIST GRID */

          <div className="wishlist-grid">

            {wishlist.map((item) => (

              <div
                className="wishlist-card"
                key={item.id}
              >

                <div className="wishlist-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <button
                    className="wishlist-remove"
                    title="Remove from wishlist"
                    onClick={() =>
                      removeFromWishlist(item.id)
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>


                <div className="wishlist-info">

                  <span className="wishlist-category">
                    {item.category}
                  </span>

                  <h3>{item.name}</h3>


                  <div className="wishlist-location">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>


                  <div className="wishlist-bottom">

                    <div className="wishlist-price">
                      <strong>
                        ₹{item.price}
                      </strong>

                      <span>/ day</span>
                    </div>


                    <button
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

        )}

      </div>

    </div>
  );
}

export default Wishlist;