import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const isAdmin = userProfile?.role === "admin";

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={currentUser ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/"} className="navbar-brand-custom">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">Smart<span className="brand-accent">Canteen</span></span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          {!currentUser ? (
            <>
              <Link to="/" className={`nav-link-custom ${location.pathname === "/" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/login" className={`nav-link-custom ${location.pathname === "/login" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-nav-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/admin/dashboard" className={`nav-link-custom ${location.pathname === "/admin/dashboard" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/menu" className={`nav-link-custom ${location.pathname === "/admin/menu" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Menu</Link>
              <Link to="/admin/orders" className={`nav-link-custom ${location.pathname === "/admin/orders" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link to="/admin/feedback" className={`nav-link-custom ${location.pathname === "/admin/feedback" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Feedback</Link>
              <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`nav-link-custom ${location.pathname === "/dashboard" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/menu" className={`nav-link-custom ${location.pathname === "/menu" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Menu</Link>
              <Link to="/orders" className={`nav-link-custom ${location.pathname === "/orders" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link to="/feedback" className={`nav-link-custom ${location.pathname === "/feedback" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Feedback</Link>
              <Link to="/cart" className="cart-btn" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
              <span className="nav-user-name">Hi, {userProfile?.name?.split(" ")[0] || "User"}</span>
              <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
