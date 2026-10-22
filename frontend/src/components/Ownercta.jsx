import { useNavigate } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  SlidersHorizontal,
  Users,
  IndianRupee,
} from "lucide-react";

import cameraImg from "../assets/cam1.png";
import applianceImg from "../assets/cooler1.png";

import "./OwnerCTA.css";

function OwnerCTA() {
  const navigate = useNavigate();

  return (
    <section className="owner-cta">

      <div className="owner-cta-inner">

        {/* ================= LEFT SIDE ================= */}

        <div className="owner-cta-content">

          <div className="owner-cta-badge">
            <span className="badge-dot"></span>
            100% FREE LISTINGS
          </div>

          <h2 className="owner-cta-heading">
            Put your idle items to
            <br />
            <span className="highlight">work.</span>
          </h2>

          <p className="owner-cta-description">
            List an item in about two minutes. No listing fee, no
            monthly plan — you pay only at a verified hand-over.
          </p>

          <div className="owner-cta-buttons">
            <button
              className="owner-primary-btn"
              onClick={() => navigate("/list-item")}
            >
              <Plus size={18} />
              List Your Item — Free
            </button>

            <button
              className="owner-secondary-btn"
              onClick={() => navigate("/browse")}
            >
              Borrow an Item
            </button>
          </div>

          <div className="owner-cta-pills">
            <div className="cta-pill">
              <TrendingUp size={15} />
              Earn from what you own
            </div>
            <div className="cta-pill">
              <SlidersHorizontal size={15} />
              You set the price
            </div>
            <div className="cta-pill">
              <Users size={15} />
              Reach renters near you
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="owner-cta-visual">

          <div className="owner-card owner-card-camera">
            <div className="owner-card-image">
              <span className="live-badge">
                <span className="live-dot"></span>
                LIVE
              </span>
              <img src={cameraImg} alt="DSLR Camera Kit" />
            </div>
            <div className="owner-card-info">
              <h3>DSLR Camera Kit</h3>
              <p>₹800/day</p>
            </div>
          </div>

          <div className="owner-card owner-card-appliance">
            <div className="owner-card-image">
              <span className="live-badge">
                <span className="live-dot"></span>
                LIVE
              </span>
              <img src={applianceImg} alt="Washing Machine" />
            </div>
            <div className="owner-card-info">
              <h3>Washing Machine</h3>
              <p>₹300/day</p>
            </div>
          </div>

          <div className="owner-stat-chip">
            <div className="stat-chip-icon">
              <IndianRupee size={18} />
            </div>
            <div>
              <strong>₹0 to list</strong>
              <span>unlimited products</span>
            </div>
          </div>

          <div className="owner-earnings-card">
            <span className="earnings-label">EARNED THIS MONTH</span>
            <strong className="earnings-amount">₹14,600</strong>
            <div className="earnings-bar">
              <div className="earnings-bar-fill"></div>
            </div>
            <span className="earnings-note">across 3 active listings</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default OwnerCTA;