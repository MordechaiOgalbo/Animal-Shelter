import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Assets/Noah's-Ark-Logo2.png";
import "./Header.css";
import { toast } from "react-toastify";

const Header = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current || "light");

    // Fetch user data from API
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      // User not logged in or token expired - try localStorage as fallback
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/me`, {
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hamburgerOpen && !event.target.closest('.hamburger-btn') && !event.target.closest('.hamburger-menu')) {
        setHamburgerOpen(false);
      }
      if (notifOpen && !event.target.closest('.notif-btn') && !event.target.closest('.notif-menu')) {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hamburgerOpen, notifOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);
  const toggleNotif = async () => {
    if (!user) return;
    if (!notifOpen) await fetchNotifications();
    setNotifOpen((prev) => !prev);
  };

  const closeHamburger = () => setHamburgerOpen(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    setMenuOpen(false);
    setNotifOpen(false);
    setNotifications([]);
    setUnreadCount(0);
    navigate("/");
  };

  const handleMarkRead = async (notifId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/me/${notifId}/read`, {}, { withCredentials: true });
      await fetchNotifications();
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteNotif = async (notif) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notifications/me/${notif._id}/delete`,
        {},
        { withCredentials: true }
      );
      await fetchNotifications();

      const UndoToast = ({ closeToast }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span>Notification removed.</span>
          <button
            onClick={async () => {
              closeToast();
              try {
                await axios.put(
                  `${import.meta.env.VITE_API_URL}/api/notifications/me/${notif._id}/restore`,
                  {},
                  { withCredentials: true }
                );
                await fetchNotifications();
              } catch (e) {
                // ignore
              }
            }}
            style={{
              padding: "4px 12px",
              background: "white",
              color: "#3bab7e",
              border: "1px solid #3bab7e",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Undo
          </button>
        </div>
      );

      toast.success(<UndoToast />, { autoClose: 8000, closeOnClick: false });
    } catch (e) {
      // ignore
    }
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

          {user && (
            <div className="notif-container">
              <button
                className="notif-btn"
                onClick={toggleNotif}
                aria-label="Notifications"
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="notif-menu">
                  <div className="notif-menu-header">
                    <span className="notif-menu-title">Notifications</span>
                    <Link
                      to="/profile"
                      className="notif-menu-link"
                      onClick={() => {
                        setNotifOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      View all
                    </Link>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications yet.</div>
                  ) : (
                    <div className="notif-list">
                      {notifications.slice(0, 6).map((n) => (
                        <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`}>
                          <div className="notif-item-main">
                            <div className="notif-item-title">{n.title}</div>
                            {n.message && <div className="notif-item-msg">{n.message}</div>}
                          </div>
                          <div className="notif-item-actions">
                            <Link
                              to={`/notification/${n._id}`}
                              className="notif-open"
                              onClick={() => {
                                handleMarkRead(n._id);
                                setNotifOpen(false);
                              }}
                            >
                              View
                            </Link>
                            {!n.read && (
                              <button className="notif-read" onClick={() => handleMarkRead(n._id)}>
                                Mark read
                              </button>
                            )}
                            <button className="notif-delete" onClick={() => handleDeleteNotif(n)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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