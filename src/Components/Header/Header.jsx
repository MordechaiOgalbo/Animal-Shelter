import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null); // replace with your auth logic
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current || "light");

    // Example: load user from localStorage or auth system
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Home leftmost */}
        <Link to="/" className="header-home">Home</Link>

        {/* Right side: theme toggle and avatar */}
        <div className="header-right">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          <div className="avatar-container" onClick={toggleMenu}>
            {user ? (
              <img src={user.avatar} alt="User Avatar" className="avatar-circle" />
            ) : (
              <div className="avatar-circle">G</div>
            )}

            {menuOpen && (
              <div className="avatar-menu">
                {!user ? (
                  <>
                    <Link to="/login" className="menu-item">Login</Link>
                    <Link to="/register" className="menu-item">Register</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="menu-item">Profile</Link>
                    <button onClick={handleLogout} className="menu-item logout-btn">Log Out</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;