import { ShieldCheck, Truck, CalendarClock, Lock } from "lucide-react";
import "./WhyChooseUs.css";

function WhyChooseUs() {

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Listings",
      description: "Every item is checked before it goes live, so what you see is what you get.",
    },
    {
      icon: Truck,
      title: "Doorstep Delivery",
      description: "We bring it straight to you, quick, easy and hassle-free.",
    },
    {
      icon: CalendarClock,
      title: "Flexible Rental Dates",
      description: "Rent for a day, a week, or a month, whatever suits you.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Every transaction is protected, with no hidden charges.",
    },
  ];

  return (
    <section className="why-choose-us">

      <div className="why-inner">

        <h2 className="why-heading">
          Why choose <span className="why-brand">MineForNow</span>?
        </h2>

        <div className="why-grid">

          {benefits.map((benefit) => {

            const Icon = benefit.icon;

            return (
              <div className="why-card" key={benefit.title}>

                <div className="why-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}

export default WhyChooseUs;