import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  Truck,
  Lock,
  RotateCcw,
  Headphones,
  Check,
} from "lucide-react";

import "./Checkout.css";

// Flat delivery fee applied per order — adjust here if you want it to
// vary by item count, location, etc.
const DELIVERY_FEE = 150;

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("mineForNowUser") || "null"
  );

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("mineForNowCart") || "[]"
    );

    setCart(savedCart);
  }, []);

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

  const totalDeposit = cart.reduce(
    (total, item) =>
      total + Number(item.securityDeposit || 0) * Number(item.quantity || 1),
    0
  );

  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;

  const dueToday = grandTotal + deliveryFee;

  const handleConfirmRental = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/browse");
      return;
    }

    // Verify availability before proceeding
    const freshListings = JSON.parse(localStorage.getItem("mineForNowListings") || "[]");
    const unavailableCartItem = cart.find(cartItem => {
      const match = freshListings.find(l => String(l.id) === String(cartItem.id));
      return match && (match.availability === "unavailable" || match.isAvailable === false);
    });

    if (unavailableCartItem) {
      alert(`"${unavailableCartItem.name}" has already been rented by another user and is no longer available.`);
      return;
    }

    // If ANY item in the cart needs owner approval, the whole order goes
    // through the request-first flow (no payment yet). Only when every
    // item is instant-book do we send the renter straight to Payment.
    const needsApproval = cart.some((item) => item.requiresApproval);

    if (needsApproval) {
      const existingRequests = JSON.parse(
        localStorage.getItem("mineForNowRentalRequests") || "[]"
      );

      const renterName = currentUser?.name || "You";

      const newRequests = cart.map((item) => ({
        id: Date.now() + item.id,
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        image: item.image,
        renterName: renterName,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
        dates: `${item.startDate} – ${item.endDate}`,
        rentalDays: calculateDays(item),
        pricePerDay: item.price,
        total: getItemTotal(item),
        securityDeposit: Number(item.securityDeposit || 0),
        status: "Pending",
      }));

      const updatedRequests = [...existingRequests, ...newRequests];

      localStorage.setItem(
        "mineForNowRentalRequests",
        JSON.stringify(updatedRequests)
      );

      localStorage.removeItem("mineForNowCart");

      navigate("/order-confirmed", {
        state: {
          itemCount: cart.length,
          dueToday: dueToday,
          totalDeposit: totalDeposit,
          pendingApproval: true,
        },
      });
    } else {
      // No approval needed anywhere in the cart — go straight to Payment.
      navigate("/payment", {
        state: {
          mode: "checkout",
          cart: cart,
          dueToday: dueToday,
          totalDeposit: totalDeposit,
        },
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>

          <p>Add some rental items before proceeding to checkout.</p>

          <button onClick={() => navigate("/browse")}>Browse Items</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* BACK */}

        <button className="checkout-back" onClick={() => navigate("/cart")}>
          <ArrowLeft size={17} />
          Back to Cart
        </button>


        {/* HEADER */}

        <div className="checkout-header">
          <p className="checkout-eyebrow">FINAL STEP</p>
          <h1>Checkout</h1>
          <p>Review your rental details before confirming.</p>
        </div>


        {/* PROGRESS STEPPER */}

        <div className="checkout-stepper">

          <div className="stepper-step done">
            <div className="stepper-circle">
              <Check size={14} />
            </div>
            <div className="stepper-label">
              <strong>Cart</strong>
              <span>Items reviewed</span>
            </div>
          </div>

          <div className="stepper-line"></div>

          <div className="stepper-step active">
            <div className="stepper-circle">2</div>
            <div className="stepper-label">
              <strong>Checkout</strong>
              <span>You are here</span>
            </div>
          </div>

          <div className="stepper-line"></div>

          <div className="stepper-step">
            <div className="stepper-circle">3</div>
            <div className="stepper-label">
              <strong>Confirmed</strong>
              <span>Awaiting approval</span>
            </div>
          </div>

        </div>


        <div className="checkout-layout">

          {/* LEFT SIDE */}

          <div className="checkout-main">

            {/* RENTER DETAILS */}

            <section className="checkout-section">
              <h2>Renter Details</h2>

              <div className="renter-details">
                <div>
                  <span>Full Name</span>
                  <strong>{currentUser?.name || "You"}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{currentUser?.email || "Not provided"}</strong>
                </div>

                <div>
                  <span>Phone Number</span>
                  <strong>{currentUser?.phone || "Not provided"}</strong>
                </div>
              </div>
            </section>


            {/* RENTAL ITEMS */}

            <section className="checkout-section">
              <h2>Rental Items</h2>

              <div className="checkout-items">
                {cart.map((item) => {

                  const days = calculateDays(item);
                  const total = getItemTotal(item);

                  return (
                    <div className="checkout-item" key={item.id}>

                      <img src={item.image} alt={item.name} />

                      <div className="checkout-item-info">
                        <span>{item.category}</span>

                        <h3>{item.name}</h3>

                        <p>
                          <MapPin size={14} />
                          {item.location}
                        </p>

                        <div className="checkout-dates">
                          <div>
                            <Calendar size={14} />
                            <span>{item.startDate}</span>
                          </div>

                          <span>→</span>

                          <div>
                            <Calendar size={14} />
                            <span>{item.endDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="checkout-item-price">
                        <span>
                          ₹{item.price} × {days} {days === 1 ? "day" : "days"}
                        </span>

                        <strong>₹{total}</strong>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>


            {/* TRUST BADGES */}

            <section className="checkout-section">
              <h2>What's Included</h2>

              <div className="checkout-includes">
                <div className="includes-item">
                  <Truck size={16} />
                  Doorstep Delivery
                </div>
                <div className="includes-item">
                  <Lock size={16} />
                  Secure Checkout
                </div>
                <div className="includes-item">
                  <RotateCcw size={16} />
                  Easy Returns
                </div>
                <div className="includes-item">
                  <Headphones size={16} />
                  24/7 Support
                </div>
              </div>
            </section>


            {/* CONFIRMATION NOTE */}

            <div className="checkout-note">
              <CheckCircle size={19} />

              <p>
                Your rental request will be sent to the item owner for
                confirmation.
              </p>
            </div>

          </div>


          {/* RIGHT SIDE */}

          <aside className="checkout-summary">

            <h2>Rental Summary</h2>

            <div className="summary-line">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="summary-line">
              <span>Rental total</span>
              <span>₹{grandTotal}</span>
            </div>

            <div className="summary-line">
              <span>Delivery fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="summary-line deposit-line">
              <span>Security deposit (refundable)</span>
              <span>₹{totalDeposit}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Due today</span>
              <strong>₹{dueToday}</strong>
            </div>

            <button
              className="confirm-rental-button"
              onClick={handleConfirmRental}
            >
              {cart.some((item) => item.requiresApproval)
                ? "Confirm Rental"
                : "Proceed to Payment"}
            </button>

            <p className="summary-note">
              {cart.some((item) => item.requiresApproval)
                ? "Security deposit is collected separately and refunded on successful return. No payment is processed at this stage."
                : "You'll pay securely on the next step. Security deposit is refunded on successful return."}
            </p>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Checkout;