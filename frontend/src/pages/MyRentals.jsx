import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Clock3,
  IndianRupee,
  ShieldCheck,
  Award,
} from "lucide-react";

import "./MyRentals.css";

function MyRentals() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("mineForNowRentalRequests") || "[]"
    );

    setRentals(savedRequests);
  }, []);

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const formatDate = (date) => {
    if (!date) return "Not selected";

    const formatted = new Date(`${date}T00:00:00`);

    return formatted.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleCancelRental = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this rental request?"
    );

    if (!confirmCancel) return;

    const updatedRentals = rentals.filter((rental) => rental.id !== id);

    setRentals(updatedRentals);

    localStorage.setItem(
      "mineForNowRentalRequests",
      JSON.stringify(updatedRentals)
    );
  };

  // Sends the renter to Payment for an already-approved request.
  // Payment.jsx updates this request's status to "Confirmed" once paid.
  const handlePayNow = (rental) => {
    navigate("/payment", {
      state: {
        mode: "request",
        requestId: rental.id,
        amount: rental.total || 0,
        securityDeposit: rental.securityDeposit || 0,
      },
    });
  };

  return (
    <div className="my-rentals-page">

      <div className="my-rentals-container">

        {/* BACK */}

        <button
          className="my-rentals-back"
          onClick={() => navigate("/browse")}
        >
          <ArrowLeft size={17} />
          Back to Browse
        </button>


        {/* HEADER */}

        <div className="my-rentals-header">

          <div>
            <p>YOUR RENTALS</p>

            <h1>My Rentals</h1>

            <span>Track your rental requests and current rentals.</span>
          </div>

          {rentals.length > 0 && (
            <div className="my-rentals-count">
              {rentals.length} {rentals.length === 1 ? "Rental" : "Rentals"}
            </div>
          )}

        </div>


        {/* EMPTY */}

        {rentals.length === 0 ? (

          <div className="my-rentals-empty">

            <div className="empty-rentals-icon">
              <CalendarDays size={34} />
            </div>

            <h2>No rentals yet</h2>

            <p>Items you confirm from checkout will appear here.</p>

            <button onClick={() => navigate("/browse")}>
              Explore Items
            </button>

          </div>

        ) : (

          /* RENTALS */

          <div className="my-rentals-list">

            {rentals.map((rental) => {

              const status = rental.status || "Pending";
              const isApproved = status === "Approved";

              return (
                <div className="my-rental-card" key={rental.id}>

                  {/* IMAGE */}

                  <div className="my-rental-image">
                    <img
                      src={rental.image || "/src/assets/placeholder.jpg"}
                      alt={rental.itemName}
                    />
                  </div>


                  {/* MAIN INFORMATION */}

                  <div className="my-rental-content">

                    <div className="my-rental-top">

                      <div>
                        <span className="my-rental-category">
                          {rental.category || "Rental Item"}
                        </span>

                        <h2>{rental.itemName}</h2>

                        <div className="my-rental-location">
                          <MapPin size={15} />
                          <span>{rental.location || "Mumbai"}</span>
                        </div>
                      </div>


                      {/* STATUS */}

                      <span
                        className={`my-rental-status ${getStatusClass(
                          status
                        )}`}
                      >
                        <span className="status-dot"></span>
                        {status}
                      </span>

                    </div>


                    {/* RENTAL DETAILS */}

                    <div className="my-rental-details">

                      <div className="rental-detail-box">
                        <CalendarDays size={17} />
                        <div>
                          <span>START DATE</span>
                          <strong>{formatDate(rental.startDate)}</strong>
                        </div>
                      </div>

                      <div className="rental-detail-box">
                        <CalendarDays size={17} />
                        <div>
                          <span>END DATE</span>
                          <strong>{formatDate(rental.endDate)}</strong>
                        </div>
                      </div>

                      <div className="rental-detail-box">
                        <Clock3 size={17} />
                        <div>
                          <span>RENTAL PERIOD</span>
                          <strong>
                            {rental.rentalDays || 1}{" "}
                            {Number(rental.rentalDays) === 1 ? "day" : "days"}
                          </strong>
                        </div>
                      </div>

                    </div>


                    {/* OWNER TRUST SCORE AWARDED */}
                    {rental.trustScore && (
                      <div className="my-rental-trust-card">
                        <div className="trust-card-header">
                          <div className="trust-badge-label">
                            <ShieldCheck size={16} />
                            <strong>Owner Trust Feedback Awarded</strong>
                          </div>
                          <span className="trust-score-val">★ {rental.trustScore.overall} / 5.0</span>
                        </div>
                        <div className="trust-pillars-row">
                          <span>Care: <strong>{rental.trustScore.care}★</strong></span>
                          <span>Punctuality: <strong>{rental.trustScore.punctuality}★</strong></span>
                          <span>Communication: <strong>{rental.trustScore.communication}★</strong></span>
                        </div>
                        {rental.trustScore.tags && rental.trustScore.tags.length > 0 && (
                          <div className="trust-tags-row">
                            {rental.trustScore.tags.map((t) => (
                              <span key={t} className="trust-pill-tag">✓ {t}</span>
                            ))}
                          </div>
                        )}
                        {rental.trustScore.comment && (
                          <p className="trust-owner-quote">"{rental.trustScore.comment}"</p>
                        )}
                      </div>
                    )}

                    {/* BOTTOM */}

                    <div className="my-rental-bottom">

                      <div className="my-rental-price">
                        <span>₹{rental.pricePerDay || 0} / day</span>

                        <strong>
                          <IndianRupee size={17} />
                          {rental.total || 0}
                        </strong>

                        <small>Total rental amount</small>
                      </div>


                      <div className="my-rental-actions">

                        {isApproved && (
                          <button
                            className="pay-now-button"
                            onClick={() => handlePayNow(rental)}
                          >
                            Pay Now
                          </button>
                        )}

                        {/* Cancel is only available for active/pending requests, NOT when order is completed */}
                        {(status === "Pending" || status === "Approved") && (
                          <button
                            className="cancel-rental-button"
                            onClick={() => handleCancelRental(rental.id)}
                          >
                            Cancel Request
                          </button>
                        )}

                        {/* Completed order actions */}
                        {status === "Completed" && (
                          <button
                            className="rent-again-button"
                            onClick={() => navigate("/browse")}
                          >
                            Rent Again
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyRentals;