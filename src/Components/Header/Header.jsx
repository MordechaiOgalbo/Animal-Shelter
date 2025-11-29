import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
    document.documentElement.setAttribute("data-theme", current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="header-home">
          Home
        </Link>

        <div className="header-links">
          <Link to="/login" className="header-link">
            Login
          </Link>
          <Link to="/register" className="header-link">
            Register
          </Link>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
