import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder, createPayment } from "../../services/firestoreService";
import Footer from "../../components/Footer/Footer";
import "./OrderConfirmation.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / Google Pay", icon: "fas fa-mobile-alt" },
  { id: "card", label: "Debit / Credit Card", icon: "fas fa-credit-card" },
  { id: "netbanking", label: "Net Banking", icon: "fas fa-university" },
  { id: "cash", label: "Pay at Counter", icon: "fas fa-money-bill-wave" },
];

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const { clearCart } = useCart();

  const { cartItems = [], totalPrice = 0, taxes = 0, grandTotal = 0 } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Success

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const orderId = await createOrder({
        userId: currentUser.uid,
        userName: userProfile?.name,
        items: cartItems.map((i) => ({
          itemId: i.itemId,
          itemName: i.itemName,
          price: i.price,
          quantity: i.quantity,
        })),
        totalPrice: grandTotal,
        note,
        orderStatus: "confirmed",
      });

      await createPayment({
        orderId,
        userId: currentUser.uid,
        amount: grandTotal,
        paymentMethod,
        paymentStatus: "completed",
      });

      clearCart();
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 3) {
    return (
      <div className="confirmation-page page-wrapper">
        <div className="success-container">
          <div className="success-animation">✅</div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-subtitle">
            Your order has been confirmed. It will be ready for pickup shortly.
          </p>
          <div className="success-info">
            <div className="success-info-item">
              <span>Payment</span>
              <strong>₹{grandTotal}</strong>
            </div>
            <div className="success-info-item">
              <span>Method</span>
              <strong>{PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}</strong>
            </div>
            <div className="success-info-item">
              <span>Status</span>
              <strong className="text-success">Confirmed ✓</strong>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn-track-order" onClick={() => navigate("/orders")}>
              Track My Order <i className="fas fa-map-marker-alt"></i>
            </button>
            <button className="btn-back-menu" onClick={() => navigate("/menu")}>
              Order More
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="confirmation-page page-wrapper">
      <div className="confirmation-container">
        <h1 className="confirmation-title">Confirm Your Order</h1>

        {/* Steps Indicator */}
        <div className="steps-indicator">
          <div className={`step-dot ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`step-line ${step >= 2 ? "filled" : ""}`}></div>
          <div className={`step-dot ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`step-line ${step >= 3 ? "filled" : ""}`}></div>
          <div className={`step-dot ${step >= 3 ? "active" : ""}`}>3</div>
        </div>
        <div className="steps-labels">
          <span>Review</span>
          <span>Payment</span>
          <span>Done</span>
        </div>

        <div className="confirmation-layout">
          {/* Left: Order Details */}
          <div className="order-review-section">
            <h3 className="review-heading">Order Items</h3>
            {cartItems.map((item, i) => (
              <div key={i} className="review-item">
                <div className="review-item-name">{item.itemName}</div>
                <div className="review-item-qty">x{item.quantity}</div>
                <div className="review-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <div className="review-totals">
              <div className="review-total-line">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="review-total-line">
                <span>Tax (5%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="review-total-line grand">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {step === 1 && (
              <>
                <div className="note-group">
                  <label>Special Instructions (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special requests? e.g. No onions, extra spice..."
                    rows={3}
                  />
                </div>
                <button className="btn-next-step" onClick={() => setStep(2)}>
                  Continue to Payment <i className="fas fa-arrow-right"></i>
                </button>
              </>
            )}
          </div>

          {/* Right: Payment */}
          {step === 2 && (
            <div className="payment-section">
              <h3 className="review-heading">Choose Payment Method</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <i className={method.icon}></i>
                    <span>{method.label}</span>
                    {paymentMethod === method.id && (
                      <i className="fas fa-check-circle payment-check"></i>
                    )}
                  </label>
                ))}
              </div>

              <div className="payment-simulation-note">
                <i className="fas fa-info-circle"></i>
                <span>This is a payment simulation. No real transaction occurs.</span>
              </div>

              <div className="payment-actions">
                <button className="btn-back-step" onClick={() => setStep(1)}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <button
                  className="btn-pay-now"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <span><span className="btn-spinner-white"></span> Processing...</span>
                  ) : (
                    <span>Pay ₹{grandTotal} <i className="fas fa-lock"></i></span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderConfirmation;
