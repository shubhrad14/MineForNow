import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroSlider.css";

import electronicsImg1 from "../assets/cooler1.png"
import electronicsImg2 from "../assets/Heroele.png"
import electronicsImg3 from "../assets/HeroMonitor.png"
import electronicsImg4 from "../assets/HeroSpeaker.png"
import electronicsImg5 from "../assets/HeroTent.png"
import electronicsImg6 from "../assets/HeroVR.png"
import electronicsImg7 from "../assets/medicaleq.png"
import electronicsImg from "../assets/cam1.png";
const slides = [
  {
    id: 1,
    brand: "MineForNow",
    eyebrow: "WELCOME TO",
    title: "Everything You Need,",
    titleLine2: "Nothing You Own.",
    description: "Electronics, appliances, medical gear and more — rent it for as long as you need it.",
    cta: "Start Exploring",
    ctaLink: "/browse",
    bg: "#2f4a3d", // deep green — brand intro slide
    image: electronicsImg1,
  },
  {
    id: 2,
    eyebrow: "TECH ON DEMAND",
    title: "Cameras, Laptops",
    titleLine2: "& Gadgets — By the Day.",
    description: "Get the tech you need without the price tag of owning it.",
    cta: "Explore Electronics",
    ctaLink: "/browse?category=Electronics",
    bg: "#1f3a4d", // deep blue
    image : electronicsImg ,
  },
  {
    id: 3,
    eyebrow: "SETTING UP HOME",
    title: "Everything Your Home",
    titleLine2: "Needs, Minus the Commitment.",
    description: "Washing machines, coolers, microwaves — rent for as long as you need.",
    cta: "Browse Appliances",
    ctaLink: "/browse?category=Home Appliances",
    bg: "#4d3a1f", // warm brown
    image:electronicsImg2,
  },
  {
    id: 4,
    eyebrow: "CARE WHEN YOU NEED IT",
    title: "Recovery Made Easier,",
    titleLine2: "Delivered to Your Door.",
    description: "Wheelchairs, oxygen concentrators and mobility aids, ready when you are.",
    cta: "View Medical Equipment",
    ctaLink: "/browse?category=Medical Equipment",
    bg: "#3a4d4a", // muted teal-green
    image:electronicsImg7,
  },
  {
    id: 5,
    eyebrow: "GAME ON",
    title: "Consoles, VR & Gear",
    titleLine2: "for Your Next Game Night.",
    description: "Try the latest console without buying hardware you'll use once.",
    cta: "Explore Gaming",
    ctaLink: "/browse?category=Gaming",
    bg: "#3a2f4d", // deep purple
    image :electronicsImg6,
  },
  {
    id: 6,
    eyebrow: "HOSTING SOMETHING?",
    title: "Everything for the Party,",
    titleLine2: "Nothing to Store After.",
    description: "Speakers, lights, tables and more — rent for the night, return the morning after.",
    cta: "Plan Your Party",
    ctaLink: "/browse?category=Party",
    bg: "#4d2f38", // deep maroon
    image:electronicsImg4,
  },
  {
    id: 7,
    eyebrow: "GET OUTDOORS",
    title: "Pack Light.",
    titleLine2: "Rent the Rest.",
    description: "Tents, camping gear and road-trip essentials, adventure-ready without the clutter.",
    cta: "Gear Up for the Trip",
    ctaLink: "/browse?category=Weekend Camping & Road Trips",
    bg: "#2f3d2a", // forest green
    image:electronicsImg5,
  },
  {
    id: 8,
    eyebrow: "FOCUSED & PRODUCTIVE",
    title: "A Proper Setup,",
    titleLine2: "Wherever You Work From.",
    description: "Desks, chairs, monitors and more, without buying furniture you'll move again.",
    cta: "Shop Work & Study",
    ctaLink: "/browse?category=Work & Study",
    bg: "#1f2d3a", // dark slate blue
    image:electronicsImg3,
  },
];

function HeroSlider() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ===== KEYBOARD ARROW KEY SUPPORT =====

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // ===== SWIPE / TOUCH SUPPORT =====

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // swiped left -> next slide
      goNext();
    } else if (distance < -minSwipeDistance) {
      // swiped right -> previous slide
      goPrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div
      className="hero-slider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            className="hero-slide"
            key={slide.id}
            style={{ backgroundColor: slide.bg }}
          >
            {slide.brand && (
              <div className="slide-brand">{slide.brand}</div>
            )}

            <div className="slide-content">
              <p className="slide-eyebrow">{slide.eyebrow}</p>
              <h2 className="slide-title">
                {slide.title}
                <br />
                {slide.titleLine2}
              </h2>
              <p className="slide-description">{slide.description}</p>
              <button
                className="slide-cta"
                onClick={() => navigate(slide.ctaLink)}
              >
                {slide.cta}
              </button>
            </div>

            <div className="slide-visual">
              <img src={slide.image} alt={slide.title} className="slide-photo" />
            </div>
          </div>
        ))}
      </div>

      {/* ARROWS */}
      <button className="slider-arrow arrow-left" onClick={goPrev}>
        <ChevronLeft size={22} />
      </button>
      <button className="slider-arrow arrow-right" onClick={goNext}>
        <ChevronRight size={22} />
      </button>

      {/* DOTS */}
      <div className="slider-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`slider-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;