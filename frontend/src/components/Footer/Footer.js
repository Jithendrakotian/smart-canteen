import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-icon">🍽️</span>
          <span className="footer-title">Smart<span>Canteen</span></span>
        </div>
        <p className="footer-tagline">Pre-order your meals, skip the queue!</p>
        <p className="footer-copy">© {new Date().getFullYear()} SmartCanteen. Built for college students.</p>
      </div>
    </footer>
  );
}

export default Footer;
