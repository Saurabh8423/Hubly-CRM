import React from "react";
import "./Pricing.css";

export default function Pricing() {
  return (
    <section className="pricing-container">
      <h2>We have plans for everyone!</h2>
      <h5 className="pricing-sub">
        We started with a strong foundation, then simply built all of the sales and <br /> marketing tools ALL businesses need under one platform.
      </h5>

      <div className="pricing-grid">
        {/* Card 1 */}
        <div className="pricing-card">
          <h4>STARTER</h4>
          <h5>Best for local businesses needing to improve their online reputation.</h5>
          <div className="price">$199 <span>/monthly</span></div>
          <h6>What’s included</h6>
          <ul>
            <li>Unlimited Users</li>
            <li>GMB Messaging</li>
            <li>Reputation Management</li>
            <li>GMB Call Tracking</li>
                <li>24/7 Award Winning Support</li>
          </ul>
          <button className="btn-first btn-outline">SIGN UP FOR STARTER</button>
        </div>

        {/* Card 2 */}
        <div className="pricing-card">
          <h4>GROW</h4>
          <h5>Best for all businesses that want to take full control of their marketing automation.</h5>
              <div className="price">$399 <span>/monthly</span></div>
              <h6>What’s included</h6>
              <ul>
                <li>Pipeline Management</li>
                <li>Marketing Automation Campaigns</li>
                <li>Live Call Transfer</li>
                <li>GMB Messaging</li>
                <li>Embed-able Form Builder</li>
                <li>Reputation Management</li>
                <li>24/7 Award Winning Support</li>
              </ul>
          <button className="btn-second btn-outline">SIGN UP FOR GROW</button>
        </div>
      </div>
    </section>
  );
}
