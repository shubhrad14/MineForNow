import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MapPin,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./ProductDetails.css";

function ProductDetails() {
  const navigate = useNavigate();

  const item = {
    name: "Canon Camera",
    category: "Electronics",
    location: "Mumbai",
    price: 800,
    period: "/ day",
    image: "/src/assets/camera.jpg",
    description:
      "A high-quality Canon camera suitable for photography, events, travel and special occasions. Rent it for the days you need without buying expensive equipment.",
    owner: "Rahul",
    available: true,
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate rental days
  const calculateDays = () => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;
    const days = difference / (1000 * 60 * 60 * 24);

    return days > 0 ? days : 0;
  };

  const rentalDays = calculateDays();

  const rentalAmount = rentalDays * item.price;

  // MineForNow service fee
  const serviceFee = rentalDays > 0 ? 80 : 0;

  const totalAmount = rentalAmount + serviceFee;

  return (
    <div className="product-details-page">

      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/browse")}
      >
        <ArrowLeft size={18} />
        Back to Browse
      </button>


      <section className="product-details">

        {/* Product Image */}
        <div className="product-image-section">

          <div className="product-image">

            <button className="product-wishlist">
              <Heart size={21} />
            </button>

            <img
              src={item.image}
              alt={item.name}
            />

          </div>

        </div>


        {/* Product Information */}
        <div className="product-info">

          <span className="product-category">
            {item.category}
          </span>

          <h1>{item.name}</h1>

          <div className="product-location">
            <MapPin size={17} />
            <span>{item.location}</span>
          </div>


          <div className="product-price">
            <strong>₹{item.price}</strong>
            <span>{item.period}</span>
          </div>


          <div className="product-divider"></div>


          {/* Description */}
          <div className="product-description">

            <h3>About this item</h3>

            <p>
              {item.description}
            </p>

          </div>


          {/* Owner */}
          <div className="product-owner">

            <div className="owner-avatar">
              {item.owner.charAt(0)}
            </div>

            <div>
              <span>Listed by</span>
              <strong>{item.owner}</strong>
            </div>

          </div>


          {/* Availability */}
          <div className="product-availability">

            <ShieldCheck size={19} />

            <span>
              {item.available
                ? "Available for rental"
                : "Currently unavailable"}
            </span>

          </div>


          {/* Rental Dates */}
          <div className="rental-dates">

            <h3>Select rental dates</h3>

            <div className="date-inputs">

              <div className="date-input">

                <CalendarDays size={17} />

                <div>
                  <span>Start date</span>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </div>

              </div>


              <div className="date-input">

                <CalendarDays size={17} />

                <div>
                  <span>End date</span>

                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    
                  />
                </div>

              </div>

            </div>

          </div>


          {/* Rental Summary */}
          {rentalDays > 0 && (
            <div className="rental-summary">

              <h3>Rental Summary</h3>

              <div className="summary-row">
                <span>
                  ₹{item.price} × {rentalDays}{" "}
                  {rentalDays === 1 ? "day" : "days"}
                </span>

                <strong>
                  ₹{rentalAmount}
                </strong>
              </div>

              <div className="summary-row">
                <span>MineForNow service fee</span>

                <strong>
                  ₹{serviceFee}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

            </div>
          )}


          {/* Book Button */}
          <button
            className="book-button"
            disabled={rentalDays === 0}
          >
            {rentalDays > 0
              ? `Book Now · ₹${totalAmount}`
              : "Select rental dates"}
          </button>

        </div>

      </section>

    </div>
  );
}

export default ProductDetails;