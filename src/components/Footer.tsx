import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__brand-link">
            <span className="footer__brand-name">CarbonPilot</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="footer__copyright">
          © 2024 CarbonPilot. Orchestrating the Net Zero transition with
          precision.
        </div>

        {/* Links */}
        <div className="footer__links">
          <Link to="/platform" className="footer__link" id="footer-platform">
            Platform
          </Link>
          <Link to="/pricing" className="footer__link" id="footer-pricing">
            Pricing
          </Link>
          <a href="#privacy" className="footer__link" id="footer-privacy">
            Privacy
          </a>
          <a href="#terms" className="footer__link" id="footer-terms">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
