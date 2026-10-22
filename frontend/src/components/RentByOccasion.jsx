import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Camera,
  BriefcaseBusiness,
  House,
  Gamepad2,
  TentTree,
} from "lucide-react";

import "./RentByOccasion.css";

function RentByOccasion() {
  const navigate = useNavigate();

  // Tracks which cards are flipped via tap/click (for touch devices,
  // which can't hover). Desktop hover is handled purely in CSS.
  const [flipped, setFlipped] = useState({});

  const occasions = [
    {
      title: "Party & Celebration",
      description: "Everything you need to make your celebration special.",
      icon: PartyPopper,
      tint: "#f3e7ea",
      accent: "#8a4550",
    },
    {
      title: "Photography",
      description: "Cameras, lenses and equipment for your next shoot.",
      icon: Camera,
      tint: "#e6edf2",
      accent: "#33566a",
    },
    {
      title: "Work & Study",
      description: "Laptops, monitors and essentials for productivity.",
      icon: BriefcaseBusiness,
      tint: "#e9e7f0",
      accent: "#453a63",
    },
    {
      title: "Moving & Home",
      description: "Useful appliances and equipment for temporary needs.",
      icon: House,
      tint: "#f3ece0",
      accent: "#6b512c",
    },
    {
      title: "Gaming",
      description:
        "Gaming consoles, headphones and accessories for your setup.",
      icon: Gamepad2,
      tint: "#ece7f3",
      accent: "#4a3d68",
    },
    {
      title: "Weekend Camping & Road Trips",
      description:
        "Tents, camping gear and essentials for your next adventure.",
      icon: TentTree,
      tint: "#e8ede6",
      accent: "#3c4d34",
    },
  ];

  const handleExplore = (e, occasion) => {
    e.stopPropagation(); // don't let the click also toggle the flip
    navigate(`/browse?occasion=${encodeURIComponent(occasion)}`);
  };

  const toggleFlip = (title) => {
    setFlipped((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  return (
    <section className="rent-occasion" id="occasions">

      {/* Section Heading */}
      <div className="occasion-heading">
        <p>RENT BY OCCASION</p>
        <h2>Whatever the moment, rent what you need.</h2>
        <span>
          Tell us what you're planning and discover items that fit the
          occasion.
        </span>
      </div>

      {/* Occasion Cards */}
      <div className="occasion-container">

        {occasions.map((occasion) => {

          const Icon = occasion.icon;
          const isFlipped = !!flipped[occasion.title];

          return (
            <div
              className="occasion-flip-outer"
              key={occasion.title}
              style={{
                "--tint": occasion.tint,
                "--accent": occasion.accent,
              }}
              onClick={() => toggleFlip(occasion.title)}
            >

              <div
                className={`occasion-flip-inner ${
                  isFlipped ? "is-flipped" : ""
                }`}
              >

                {/* FRONT — icon only */}

                <div className="occasion-face occasion-front">
                  <div className="occasion-icon">
                    <Icon size={34} strokeWidth={1.6} />
                  </div>
                  <h3>{occasion.title}</h3>
                </div>

                {/* BACK — description + button */}

                <div className="occasion-face occasion-back">
                  <h3>{occasion.title}</h3>
                  <p>{occasion.description}</p>
                  <button onClick={(e) => handleExplore(e, occasion.title)}>
                    Explore
                    <span>→</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default RentByOccasion;