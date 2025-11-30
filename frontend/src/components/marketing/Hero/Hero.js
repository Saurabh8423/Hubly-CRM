import React from "react";
import "./Hero.css";

// Hero Assets
import calendar from "../../../Assets/Calendar.png";
import card1 from "../../../Assets/Card 1.png";
import rect from "../../../Assets/Rectangle 2074.png";
import frameMain from "../../../Assets/Frame 2147223822.png";

// Companies Assets
import company1 from "../../../Assets/Company logo (1).png";
import company2 from "../../../Assets/Company logo (2).png";
import company3 from "../../../Assets/Company logo (3).png";
import company4 from "../../../Assets/Company logo (4).png";
import company5 from "../../../Assets/Company logo.png";
import company6 from "../../../Assets/Group 2147223682.png";

import ChatWidget from "../../../pages/ChatWidget/ChatWidget";

export default function Hero() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero container">
        <div className="hero-left">
          <h1>
            Grow Your Business Faster
            <br />
            with Hubly CRM
          </h1>

          <p className="lead">
            Manage leads, automate workflows, and close deals effortlessly — all in one platform.
          </p>

          <div className="hero-ctas">
            <button className="btn btn-primary">Get started ￫</button>
            <button className="btn btn-ghost">▶ Watch Video</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="scene">
            <img src={rect} alt="rect" className="scene-rect" />
             <img src={card1} alt="card" className="scene-card" />
            <img src={frameMain} alt="frame" className="scene-frame" />
            <img src={calendar} alt="calendar" className="scene-calendar" />
          </div>
        </div>
      </section>

      {/* ================= COMPANIES SECTION ================= */}
      <section className="companies">
        <div className="companies-inner">
          <img src={company1} alt="" />
          <img src={company2} alt="" />
          <img src={company3} alt="" />
          <img src={company4} alt="" />
          <img src={company5} alt="" />
          <img src={company6} alt="" />
        </div>
      </section>

      {/* Chat widget (floating) */}
      <ChatWidget />
    </>
  );
}
