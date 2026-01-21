import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Site Name / Logo */}
        <div className="footer-logo">
          <h2>Noah's Ark</h2>
        </div>

        {/* About and Contact */}
        <div className="footer-links">
          <Link to="/AboutUs">About Us</Link>
          <span>Contact: AdminEmail@gmail.com</span>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Noah's Ark. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;