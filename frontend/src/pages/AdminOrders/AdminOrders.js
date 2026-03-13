import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/firestoreService";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./AdminOrders.css";

const ORDER_STATUSES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.orderStatus === filter;
    const matchSearch =
      !search ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.userName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return <Spinner message="Loading orders..." />;

  return (
    <div className="admin-orders-page page-wrapper">
      <div className="admin-orders-container">
        <div className="admin-orders-header">
          <div>
            <h1 className="admin-orders-title">Orders Management 📦</h1>
            <p className="admin-orders-subtitle">{orders.length} total orders</p>
          </div>
          <button className="btn-refresh" onClick={loadOrders}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="orders-filter-row">
          <div className="orders-status-tabs">
            <button
              className={`orders-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({orders.length})
            </button>
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                className={`orders-tab ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)} ({orders.filter((o) => o.orderStatus === s).length})
              </button>
            ))}
          </div>
          <div className="orders-search-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by ID or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="orders-search"
            />
          </div>
        </div>

        {/* Orders Table */}
        {filtered.length === 0 ? (
          <div className="orders-admin-empty">
            <div style={{ fontSize: "3rem" }}>📭</div>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-admin-list">
            {filtered.map((order) => (
              <div key={order.orderId} className="admin-order-row">
                <div
                  className="admin-order-main"
                  onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                >
                  <div className="admin-order-id">
                    <i className="fas fa-receipt"></i>
                    #{order.orderId.slice(-8).toUpperCase()}
                  </div>
                  <div className="admin-order-student">{order.userName || "Unknown"}</div>
                  <div className="admin-order-items">{order.items?.length || 0} item(s)</div>
                  <div className="admin-order-total">₹{order.totalPrice}</div>
                  <div className="admin-order-time">{formatDate(order.orderTime)}</div>
                  <div className="admin-order-status-control" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.orderStatus || "pending"}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className={`status-select status-${order.orderStatus}`}
                      disabled={updating === order.orderId}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    {updating === order.orderId && (
                      <span className="updating-indicator">Updating...</span>
                    )}
                  </div>
                  <i className={`fas fa-chevron-${expanded === order.orderId ? "up" : "down"} expand-arrow`}></i>
                </div>

                {expanded === order.orderId && (
                  <div className="admin-order-details">
                    <div className="order-detail-grid">
                      <div>
                        <h6>Items Ordered</h6>
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="admin-detail-item">
                            <span>{item.itemName}</span>
                            <span>x{item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h6>Order Info</h6>
                        <div className="order-info-row"><span>Order ID:</span><span>{order.orderId}</span></div>
                        <div className="order-info-row"><span>Student:</span><span>{order.userName || "—"}</span></div>
                        <div className="order-info-row"><span>Total:</span><span>₹{order.totalPrice}</span></div>
                        {order.note && (
                          <div className="order-info-row">
                            <span>Note:</span>
                            <span>{order.note}</span>
                          </div>
                        )}
                      </div>
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

export default AdminOrders;
