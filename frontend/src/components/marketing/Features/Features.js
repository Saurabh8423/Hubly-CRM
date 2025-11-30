import React from "react";
import "./Features.css";
import featureRight from "../../../Assets/Frame 2147223827.png";
import featureRightSocial from "../../../Assets/feature-social.png";

export default function Features() {
  return (
    <section className="info-feature container">
      <div className="info-left">
        <h2>At its core, Hubly is a robust CRM solution.</h2>
        <p className="info-lead">
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks—saving you time and maximizing revenue. Whether
          you’re a startup or an enterprise, Hubly adapts to your needs, giving
          you the tools to scale efficiently.
        </p>

        <div className="features-cards">
          {/* LEFT SIDE */}
          <div className="feature-cards-left">
            <div className="feature-card">
              <h4>MULTIPLE PLATFORMS TOGETHER!</h4>
              <p>
                Email communication is a breeze with our fully integrated, drag
                & drop <br /> email builder.
              </p>
            </div>

            <div className="feature-card">
              <h4>CLOSE</h4>
              <p>
                Capture leads using our landing pages, surveys, forms,
                calendars, inbound phone <br /> system & more!
              </p>
            </div>

            <div className="feature-card">
              <h4>NURTURE</h4>
              <p>
                Capture leads using our landing pages, surveys, forms,
                calendars, inbound <br /> phone system & more!
              </p>
            </div>
          </div>

          {/* RIGHT SIDE IMAGES */}
          <div className="info-right">
            <div className="feature-upper">
              <img src={featureRightSocial} alt="" />
            </div>

            <div className="feature-down">
              <img src={featureRight} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
