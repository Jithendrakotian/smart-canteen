import React from "react";
import { useCart } from "../../context/CartContext";
import "./MenuCard.css";

function MenuCard({ item, showAddToCart = true }) {
  const { addToCart, cartItems } = useCart();
  const cartItem = cartItems.find((i) => i.itemId === item.itemId);
  const inCart = cartItem ? cartItem.quantity : 0;

  function handleAdd() {
    addToCart(item);
  }

  return (
    <div className="menu-card">
      <div className="menu-card-img-wrapper">
        {item.imageURL ? (
          <img src={item.imageURL} alt={item.itemName} className="menu-card-img" loading="lazy" />
        ) : (
          <div className="menu-card-placeholder">🍽️</div>
        )}
        {!item.available && (
          <div className="unavailable-overlay">Unavailable</div>
        )}
        {item.category && (
          <span className="menu-category-badge">{item.category}</span>
        )}
      </div>
      <div className="menu-card-body">
        <h6 className="menu-item-name">{item.itemName}</h6>
        <p className="menu-item-desc">{item.description}</p>
        <div className="menu-card-footer">
          <span className="menu-item-price">₹{item.price}</span>
          {showAddToCart && item.available && (
            <button className="add-to-cart-btn" onClick={handleAdd}>
              {inCart > 0 ? (
                <span>+{inCart} <i className="fas fa-check"></i></span>
              ) : (
                <span><i className="fas fa-plus"></i> Add</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
