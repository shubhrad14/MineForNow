import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Package, Home } from "lucide-react";

import "./OrderConfirmed.css";

function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  // If someone lands here directly (no state passed, e.g. a refresh),
  // there's nothing to show — send them somewhere useful instead.
  const summary = location.state;

  if (!summary) {
    return (
      <div className="confirmed-page">
        <div className="confirmed-card">
          <h2>Nothing to confirm</h2>
          <p>Looks like you got here directly.</p>
          <button onClick={() => navigate("/browse")}>Browse Items</button>
        </div>
      </div>
    );
  }

  const { itemCount, dueToday, totalDeposit } = summary;

  return (
    <div className="confirmed-page">

      <div className="confirmed-card">

        <div className="confirmed-icon">
          <CheckCircle2 size={40} />
        </div>

        <h1>Your rental request is confirmed!</h1>

        <p>
          We've sent your request to the item owner for approval. You'll be
          notified once it's accepted.
        </p>

        <div className="confirmed-summary">

          <div className="confirmed-summary-line">
            <span>Items requested</span>
            <strong>{itemCount}</strong>
          </div>

          <div className="confirmed-summary-line">
            <span>Due today</span>
            <strong>₹{dueToday}</strong>
          </div>

          <div className="confirmed-summary-line">
            <span>Security deposit (refundable)</span>
            <strong>₹{totalDeposit}</strong>
          </div>

        </div>

        <div className="confirmed-actions">

          <button
            className="confirmed-primary-btn"
            onClick={() => navigate("/my-rentals")}
          >
            <Package size={17} />
            View My Rentals
          </button>

          <button
            className="confirmed-secondary-btn"
            onClick={() => navigate("/")}
          >
            <Home size={17} />
            Back to Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderConfirmed;