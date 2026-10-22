import { useNavigate } from "react-router-dom";
import {
  Home,
  Laptop,
  HeartPulse,
  Gamepad2,
  PartyPopper,
  Tent,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Home,
      title: "Home Appliances",
      description:
        "Everything you need to make your home comfortable.",
    },
    {
      icon: Laptop,
      title: "Electronics",
      description:
        "Technology and gadgets for work, study and entertainment.",
    },
    {
      icon: HeartPulse,
      title: "Medical Equipment",
      description:
        "Equipment for temporary healthcare and mobility needs.",
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      description:
        "Consoles, VR and gear for your next game night.",
    },
    {
      icon: PartyPopper,
      title: "Party",
      description:
        "Everything you need to host without the clean-up after.",
    },
    {
      icon: Tent,
      title: "Weekend Camping & Road Trips",
      description:
        "Adventure-ready gear for the great outdoors.",
    },
    {
      icon: BookOpen,
      title: "Work & Study",
      description:
        "Desks, chairs and monitors for a proper setup.",
    },
  ];

  const handleExplore = (category) => {
    navigate(
      `/browse?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <section className="categories" id="categories">

      <div className="section-heading">

        <p>EXPLORE OUR COLLECTION</p>

        <h2>What are you looking for?</h2>

        <span>
          Find what you need and rent it for as long as you need.
        </span>

      </div>


      <div className="category-container">

        {categories.map((category) => {

          const Icon = category.icon;

          return (
            <div
              className="category-card"
              key={category.title}
            >

              <div className="category-icon">
                <Icon size={32} strokeWidth={1.8} />
              </div>

              <h3>{category.title}</h3>

              <p>
                {category.description}
              </p>

              <button
                onClick={() =>
                  handleExplore(category.title)
                }
              >
                Explore →
              </button>

            </div>
          );

        })}

        {/* VIEW ALL CARD — fills the 8th grid slot */}

        <div className="category-card view-all-card">

          <div className="category-icon">
            <LayoutGrid size={32} strokeWidth={1.8} />
          </div>

          <h3>View All</h3>

          <p>
            Browse the entire collection, all categories in one place.
          </p>

          <button onClick={() => navigate("/browse")}>
            Browse All →
          </button>

        </div>

      </div>

    </section>
  );
}

export default Categories;