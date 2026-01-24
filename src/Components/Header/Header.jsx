import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Assets/Noah's-Ark-Logo2.png";
import "./Header.css";

const Header = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current || "light");

    // Fetch user data from API
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      // User not logged in or token expired - try localStorage as fallback
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hamburgerOpen && !event.target.closest('.hamburger-btn') && !event.target.closest('.hamburger-menu')) {
        setHamburgerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hamburgerOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  const closeHamburger = () => setHamburgerOpen(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo and Site Name leftmost */}
        <Link to="/" className="header-brand">
          <img src={logo} alt="Noah's Ark Logo" className="header-logo" />
        </Link>

        {/* Right side: hamburger menu, theme toggle and avatar */}
        <div className="header-right">
          <button 
            className="hamburger-btn" 
            onClick={toggleHamburger}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${hamburgerOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${hamburgerOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${hamburgerOpen ? 'open' : ''}`}></span>
          </button>

          {hamburgerOpen && (
            <div className="hamburger-menu">
              <Link to="/" className="hamburger-menu-item" onClick={closeHamburger}>Home</Link>
              <Link to="/animalCatalog" className="hamburger-menu-item" onClick={closeHamburger}>Animal Catalog</Link>
              <Link to="/AboutUs" className="hamburger-menu-item" onClick={closeHamburger}>About Us</Link>
              <Link to="/volunteer" className="hamburger-menu-item" onClick={closeHamburger}>Volunteer</Link>
              <Link to="/donate" className="hamburger-menu-item" onClick={closeHamburger}>Donate</Link>
              <Link to="/report" className="hamburger-menu-item" onClick={closeHamburger}>Report Animal</Link>
              <Link to="/submit" className="hamburger-menu-item" onClick={closeHamburger}>Submit Animal</Link>
              {user && (
                <Link to="/profile" className="hamburger-menu-item" onClick={closeHamburger}>Profile</Link>
              )}
              {!user ? (
                <>
                  <Link to="/login" className="hamburger-menu-item" onClick={closeHamburger}>Login</Link>
                  <Link to="/register" className="hamburger-menu-item" onClick={closeHamburger}>Register</Link>
                </>
              ) : (
                <button className="hamburger-menu-item logout-btn" onClick={() => { handleLogout(); closeHamburger(); }}>Log Out</button>
              )}
            </div>
          )}

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          <div className="avatar-container" onClick={toggleMenu}>
            {user ? (
              user.profile_image ? (
                <img src={user.profile_image} alt="User Avatar" className="avatar-circle" />
              ) : (
                <div 
                  className="avatar-circle"
                  style={{
                    backgroundColor: user.profile_color || "#3bab7e",
                    color: user.profile_text_color || "#ffffff"
                  }}
                >
                  {user.user_name?.[0]?.toUpperCase() || "U"}
                </div>
              )
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