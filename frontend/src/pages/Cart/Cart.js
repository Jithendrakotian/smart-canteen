import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/Footer/Footer";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const taxes = +(totalPrice * 0.05).toFixed(2);
  const grandTotal = +(totalPrice + taxes).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-wrapper">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from our menu</p>
          <Link to="/menu" className="btn-go-menu">Browse Menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart 🛒</h1>
          <button className="btn-clear-cart" onClick={clearCart}>
            <i className="fas fa-trash"></i> Clear All
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.itemId} className="cart-item-card">
                <div className="cart-item-img">
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.itemName} />
                  ) : (
                    <span className="cart-item-emoji">🍽️</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <h5 className="cart-item-name">{item.itemName}</h5>
                  <span className="cart-item-price">₹{item.price} each</span>
                </div>
                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.itemId)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-line">
              <span>Items ({totalItems})</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Canteen Tax (5%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span className="free-tag">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-line total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              className="btn-checkout"
              onClick={() =>
                navigate("/order-confirmation", {
                  state: { cartItems, totalPrice, taxes, grandTotal },
                })
              }
            >
              Proceed to Checkout <i className="fas fa-arrow-right"></i>
            </button>

            <Link to="/menu" className="btn-add-more">
              <i className="fas fa-plus"></i> Add More Items
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
