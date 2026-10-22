import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  // Scroll to a section on the homepage
  const handleSectionClick = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // If footer is clicked from another page,
      // go to homepage first with the section id
      navigate(`/#${sectionId}`);
    }
  };

  // List an Item logic
  const handleListItem = () => {
    // Change this key later if your login system uses another key
    const user = localStorage.getItem("mineForNowUser");

    if (user) {
      // User already has an account / is logged in
      navigate("/account");
    } else {
      // User does not have an account
      navigate("/signup");
    }
  };

  return (
    <footer className="footer">

      <div className="footer-top">

        {/* Brand Column */}
        <div className="footer-brand">

          <a
            href="/"
            className="footer-logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <span>mine</span>
            <span>fornow</span>
          </a>

          <p className="footer-description">
            The neighborhood peer-to-peer rental marketplace. Borrow what you need,
            share what you own, and live sustainably without excess clutter.
          </p>

          <div className="footer-newsletter">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Subscribe
            </button>
          </div>

        </div>


        {/* Marketplace */}
        <div className="footer-links-group">

          <h4>Marketplace</h4>

          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick("categories");
            }}
          >
            Categories
          </a>

          <a
            href="#popular"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick("popular");
            }}
          >
            Popular Near You
          </a>

          <a
            href="#occasions"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick("occasions");
            }}
          >
            Rent by Occasion
          </a>

          <a
            href="#ai-recommender"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick("ai-recommender");
            }}
          >
            AI Smart Kit
          </a>

          <a
            href="#list"
            onClick={(e) => {
              e.preventDefault();
              handleListItem();
            }}
          >
            List an Item
          </a>

        </div>


        {/* Trust & Safety */}
        <div className="footer-links-group">

          <h4>Trust & Safety</h4>

          <a href="#protection">Item Protection Policy</a>
          <a href="#verification">Identity Verification</a>
          <a href="#agreement">Rental Agreement</a>
          <a href="#guidelines">Community Guidelines</a>
          <a href="#faq">Safety FAQs</a>

        </div>


        {/* Company & Support */}
        <div className="footer-links-group">

          <h4>Company & Support</h4>

          <a href="#about">About Us</a>
          <a href="#contact">Contact Support</a>
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#careers">Careers</a>
          <a
            href="/admin/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/login");
            }}
          >
            Admin Portal
          </a>

        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          &copy; 2026 MineForNow. All rights reserved.
        </p>

        <span className="footer-accent">
          Rent. Share. Live. 🌸
        </span>

      </div>

    </footer>
  );
}

export default Footer;