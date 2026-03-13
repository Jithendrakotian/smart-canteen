import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMenuItems } from "../../services/firestoreService";
import { useCart } from "../../context/CartContext";
import MenuCard from "../../components/MenuCard/MenuCard";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./Menu.css";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Snacks", "Beverages", "Desserts"];

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    getMenuItems()
      .then((items) => {
        setMenuItems(items);
        setFiltered(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = menuItems;
    if (category !== "All") {
      result = result.filter(
        (i) => i.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.itemName?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [category, search, menuItems]);

  if (loading) return <Spinner message="Loading menu..." />;

  return (
    <div className="menu-page page-wrapper">
      {/* Header */}
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h1 className="menu-hero-title">Today's Menu 🍽️</h1>
          <p className="menu-hero-sub">Fresh, delicious food prepared daily</p>
          <div className="search-bar-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="menu-search"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="menu-container">
        {/* Category Filters */}
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span>{filtered.length} item(s) found</span>
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              <i className="fas fa-times"></i> Clear
            </button>
          )}
        </div>

        {/* Items Grid */}
        {filtered.length === 0 ? (
          <div className="menu-empty">
            <div style={{ fontSize: "3.5rem" }}>🔍</div>
            <h4>No items found</h4>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map((item) => (
              <MenuCard key={item.itemId} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {totalItems > 0 && (
        <Link to="/cart" className="floating-cart">
          <div className="floating-cart-left">
            <span className="floating-cart-count">{totalItems} item(s)</span>
            <span className="floating-cart-label">View Cart</span>
          </div>
          <div className="floating-cart-right">
            ₹{totalPrice.toFixed(2)} <i className="fas fa-arrow-right"></i>
          </div>
        </Link>
      )}

      <Footer />
    </div>
  );
}

export default Menu;
