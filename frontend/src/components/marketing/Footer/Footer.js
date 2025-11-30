import React from "react";
import logo from '../../../Assets/logo (1).png';
import { FaTwitter, FaLinkedin, FaYoutube, FaEnvelope, FaInstagram, FaDiscord } from "react-icons/fa";
import { SiFigma } from "react-icons/si";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="hb-footer">

      {/* Logo */}
      <div className="hb-footer-logo">
        <img src={logo} alt="Hubly logo" />
      </div>

      <div className="hb-footer-container">

        <div className="hb-footer-columns">

          {/* COLUMN group 1 */}
          <div className="hb-footer-col-group">
            <div className="hb-footer-col">
              <h4>Product</h4>
              <p>Universal checkout</p>
              <p>Payment workflows</p>
              <p>Observability</p>
              <p>UpliftAI</p>
              <p>Apps & integrations</p>
            </div>

            <div className="hb-footer-col">
              <h4>Resources</h4>
              <p>Blog</p>
              <p>Success stories</p>
              <p>News room</p>
              <p>Terms</p>
              <p>Privacy</p>
            </div>
          </div>

          {/* COLUMN group 2 */}
          <div className="hb-footer-col-group">
            <div className="hb-footer-col">
              <h4>Why Primer</h4>
              <p>Expand to new markets</p>
              <p>Boost payment success</p>
              <p>Improve conversion rates</p>
              <p>Reduce payments fraud</p>
              <p>Recover revenue</p>
            </div>

            <div className="hb-footer-col">
              <h4>Company</h4>
              <p>Careers</p>
            </div>
          </div>

          {/* COLUMN group 3 + SOCIAL RIGHT */}
          <div className="hb-footer-col-group">
            <div className="hb-footer-col">
              <h4>Developers</h4>
              <p>Primer Docs</p>
              <p>API Reference</p>
              <p>Payment methods guide</p>
              <p>Service status</p>
              <p>Community</p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="hb-footer-socials-right">
              <FaEnvelope />
              <FaLinkedin />
              <FaTwitter />
              <FaYoutube />
              <FaDiscord />
              <SiFigma />
              <FaInstagram />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
