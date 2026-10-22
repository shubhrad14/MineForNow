// import { Search, Calendar, CreditCard, RotateCcw } from "lucide-react";
import "./HowItWorks.css";

import findImg from "../assets/Search2.png";
import datesImg from "../assets/calendar.png";
import payImg from "../assets/Payment1.png";
import returnImg from "../assets/delivery.png";

function HowItWorks() {

  const steps = [
    {
      image:findImg,
      title: "1. Find What You Need",
      description:
        "Browse thousands of items available for rent near your location, from electronics to medical equipment, and filter by category, price, and availability.",
    },
    {
      image:datesImg,
      title: "2. Choose Your Dates",
      description:
        "Select exactly when you need the item, check real-time availability, and pick a rental period that fits your schedule, whether it's a day or a month.",
    },
    {
      image: payImg,
      title: "3. Book & Pay",
      description:
        "Confirm your rental details and make a secure online payment. Your booking is instantly reserved, with no hidden fees or last-minute surprises.",
    },
    {
      image:returnImg,
      title: "4. Use & Return",
      description:
        "Enjoy the item for as long as your rental period lasts, then simply return it on time and hassle-free, ready for your next rental whenever you need it.",
    },
  ];

  return (
    <section className="how-it-works-v2">

      <div className="how-v2-container">

        <div className="how-v2-heading">
          <p>HOW IT WORKS?</p>
          <h2>Renting Made Simple in 4 Quick Steps</h2>
        </div>

        <div className="how-v2-steps">

          {steps.map((step) => {

            return (
              <div className="how-v2-step" key={step.title}>

                <div className="how-v2-illustration">
                  <img src={step.image} alt={step.title} className="how-v2-img" />
                </div>

                <div className="how-v2-text">
                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                </div>  

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;