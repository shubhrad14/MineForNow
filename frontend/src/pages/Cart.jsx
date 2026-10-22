import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const categories = [
    "Electronics",
    "Home Appliances",
    "Medical Equipment",
    "Gaming",
    "Party",
    "Weekend Camping & Road Trips",
    "Work & Study",
  ];

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("mineForNowCart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);

    localStorage.setItem("mineForNowCart", JSON.stringify(updatedCart));
  };

  const calculateDays = (item) => {
    if (!item.startDate || !item.endDate) {
      return 1;
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    const difference = (end - start) / (1000 * 60 * 60 * 24);

    return difference > 0 ? difference : 1;
  };

  const getItemTotal = (item) => {
    return calculateDays(item) * Number(item.price || 0);
  };

  const grandTotal = cart.reduce(
    (total, item) => total + getItemTotal(item),
    0
  );

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <p className="cart-eyebrow">YOUR RENTALS</p>

            <h1>My Cart</h1>

            <p>Review your rental items before checkout.</p>
          </div>

          {cart.length > 0 && (
            <div className="cart-count">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </div>
          )}

        </div>


        {/* EMPTY CART */}

        {cart.length === 0 ? (

          <div className="cart-empty">

            <div className="cart-empty-icon">
              <ShoppingCart size={30} />
            </div>

            <h2>Your cart is empty</h2>

            <p>Items you choose to rent will appear here.</p>

            <button onClick={() => navigate("/browse")}>
              Browse Items
            </button>

            {/* QUICK CATEGORY CHIPS */}

            <div className="empty-category-chips">
              <span>Or jump straight to a category</span>

              <div className="chip-row">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="category-chip"
                    onClick={() =>
                      navigate(
                        `/browse?category=${encodeURIComponent(category)}`
                      )
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

          </div>

        ) : (

          <div className="cart-layout">

            {/* CART ITEMS */}

            <div className="cart-items">

              {cart.map((item) => {

                const days = calculateDays(item);
                const itemTotal = getItemTotal(item);

                return (
                  <div className="cart-item" key={item.id}>

                    {/* IMAGE */}

                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>


                    {/* INFORMATION */}

                    <div className="cart-item-info">

                      <span className="cart-item-category">
                        {item.category}
                      </span>

                      <h3>{item.name}</h3>

                      <p className="cart-item-location">
                        {item.location}
                      </p>


                      {/* DATES */}

                      <div className="cart-item-dates">

                        <div>
                          <span>START DATE</span>
                          <strong>
                            {item.startDate || "Not selected"}
                          </strong>
                        </div>

                        <div>
                          <span>END DATE</span>
                          <strong>
                            {item.endDate || "Not selected"}
                          </strong>
                        </div>

                      </div>


                      <div className="cart-item-bottom">

                        <div className="cart-item-price">
                          <strong>₹{item.price}</strong>
                          <span>/ day</span>
                          <small>
                            × {days} {days === 1 ? "day" : "days"}
                          </small>
                        </div>

                        <strong className="cart-item-total">
                          ₹{itemTotal}
                        </strong>

                      </div>

                    </div>


                    {/* REMOVE */}

                    <button
                      className="cart-remove"
                      title="Remove from cart"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                );
              })}

            </div>


            {/* SUMMARY */}

            <aside className="cart-summary">

              <h2>Rental Summary</h2>

              <div className="cart-summary-line">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="cart-summary-line">
                <span>Rental total</span>
                <span>₹{grandTotal}</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>₹{grandTotal}</strong>
              </div>

              <button
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <p className="cart-summary-note">
                You can review your rental details before confirming.
              </p>

            </aside>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;