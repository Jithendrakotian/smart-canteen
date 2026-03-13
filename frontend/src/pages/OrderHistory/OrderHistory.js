import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../services/firestoreService";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./OrderHistory.css";

function OrderHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getUserOrders(currentUser.uid)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const STATUS_FILTERS = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  if (loading) return <Spinner message="Loading orders..." />;

  return (
    <div className="orders-page page-wrapper">
      <div className="orders-container">
        <h1 className="orders-title">My Orders 📦</h1>

        {/* Filter Tabs */}
        <div className="order-filters">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "all" ? ` (${orders.length})` : ` (${orders.filter((o) => o.orderStatus === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="orders-empty">
            <div style={{ fontSize: "4rem" }}>📭</div>
            <h4>No orders found</h4>
            <p>Orders with status "{filter}" will appear here</p>
          </div>
        ) : (
          <div className="orders-list-full">
            {filtered.map((order) => (
              <div key={order.orderId} className="order-card-full">
                <div
                  className="order-card-header"
                  onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                >
                  <div className="order-card-info">
                    <div className="order-number">
                      <i className="fas fa-receipt"></i>
                      #{order.orderId.slice(-8).toUpperCase()}
                    </div>
                    <div className="order-date-display">{formatDate(order.orderTime)}</div>
                  </div>
                  <div className="order-card-right">
                    <span className={`status-${order.orderStatus || "pending"}`}>
                      {order.orderStatus || "pending"}
                    </span>
                    <div className="order-total-display">₹{order.totalPrice}</div>
                    <i className={`fas fa-chevron-${expanded === order.orderId ? "up" : "down"} expand-icon`}></i>
                  </div>
                </div>

                {expanded === order.orderId && (
                  <div className="order-card-details">
                    <h6 className="details-heading">Items Ordered</h6>
                    <div className="order-items-list">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="order-detail-item">
                          <span className="detail-item-name">{item.itemName}</span>
                          <span className="detail-item-qty">x{item.quantity}</span>
                          <span className="detail-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.note && (
                      <div className="order-note">
                        <i className="fas fa-sticky-note"></i> {order.note}
                      </div>
                    )}
                    <div className="order-summary-row">
                      <span>Total Paid</span>
                      <strong>₹{order.totalPrice}</strong>
                    </div>

                    {/* Status Progress */}
                    <div className="status-tracker">
                      {["confirmed", "preparing", "ready", "delivered"].map((s, i) => {
                        const statuses = ["confirmed", "preparing", "ready", "delivered"];
                        const currentIndex = statuses.indexOf(order.orderStatus);
                        const isDone = i <= currentIndex;
                        return (
                          <div key={s} className={`tracker-step ${isDone ? "done" : ""}`}>
                            <div className="tracker-dot">{isDone ? "✓" : i + 1}</div>
                            <div className="tracker-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                            {i < 3 && <div className={`tracker-line ${isDone && i < currentIndex ? "done" : ""}`}></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistory;
