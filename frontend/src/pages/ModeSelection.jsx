import { ShoppingCart, X, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ModeSelection.css";

function ModeSelection() {
  const navigate = useNavigate();

  return (
    <div className="mode-page">

      {/* Heading */}
      <div className="mode-heading">
        <h1>Your Cart Looks A Little Empty!</h1>
        <p>Start Renting with us</p>
      </div>


      {/* Illustration */}
      <div className="mode-illustration">

        <div className="illustration-circle"></div>

        <div className="illustration-dot dot-one"></div>
        <div className="illustration-dot dot-two"></div>

        <X className="illustration-x x-one" size={27} />
        <X className="illustration-x x-two" size={20} />

        <ShoppingCart
          className="cart-icon"
          size={125}
          strokeWidth={1.8}
        />

      </div>


      {/* Labels */}
      <div className="mode-labels">

        <div>
          <p>Looking to</p>
          <strong>RENT something?</strong>
        </div>

        <div>
          <p>Looking to</p>
          <strong>RENT OUT something?</strong>
        </div>

      </div>


      {/* Action Buttons */}
      <div className="mode-actions">

        <button
          className="mode-rent-button"
          onClick={() => navigate("/browse")}
        >
          <span>←</span>
          EXPLORE RENTING
        </button>

        <button
          className="mode-lend-button"
          onClick={() => navigate("/owner-dashboard")}
        >
          RENT OUT YOUR ITEM
          <span>→</span>
        </button>

      </div>

    </div>
  );
}

export default ModeSelection;