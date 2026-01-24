import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Site Name / Logo */}
        <div className="footer-section footer-brand">
          <h2 className="footer-logo">Noah's Ark</h2>
          <p className="footer-tagline">Waiting for a Home</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <Link to="/AboutUs">About Us</Link>
            <Link to="/animalCatalog">Animal Catalog</Link>
            <Link to="/volunteer">Volunteer</Link>
            <Link to="/donate">Donate</Link>
            <Link to="/report">Report Animal</Link>
            <Link to="/submit">Submit Animal</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <div className="footer-contact">
            <p>Email: AdminEmail@gmail.com</p>
            <p>Phone: (02) 123-4567</p>
            <p>Available 24/7 for emergencies</p>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Noah's Ark. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;