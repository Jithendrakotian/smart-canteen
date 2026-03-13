import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, getAllUsers, getMenuItems, getAllPayments, getAllFeedback } from "../../services/firestoreService";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AdminDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllOrders(),
      getAllUsers(),
      getMenuItems(),
      getAllPayments(),
      getAllFeedback(),
    ])
      .then(([o, u, m, p, f]) => {
        setOrders(o);
        setUsers(u);
        setMenuItems(m);
        setPayments(p);
        setFeedback(f);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "completed")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "confirmed").length;
  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : "—";

  // Bar chart: Orders by status
  const statusCounts = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"].map(
    (s) => orders.filter((o) => o.orderStatus === s).length
  );

  const chartData = {
    labels: ["Pending", "Confirmed", "Preparing", "Ready", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Orders",
        data: statusCounts,
        backgroundColor: [
          "#ffc107", "#007bff", "#17a2b8", "#28a745", "#6f42c1", "#dc3545",
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const recentOrders = orders.slice(0, 5);

  if (loading) return <Spinner message="Loading admin dashboard..." />;

  return (
    <div className="admin-dashboard page-wrapper">
      {/* Header */}
      <div className="admin-header-bar">
        <div className="admin-header-content">
          <h1 className="admin-dashboard-title">
            <span className="admin-crown">👑</span> Admin Dashboard
          </h1>
          <p className="admin-subtitle">SmartCanteen Control Panel</p>
        </div>
      </div>

      <div className="admin-container">
        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon orange">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">{orders.length}</div>
              <div className="admin-stat-label">Total Orders</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon green">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">₹{totalRevenue.toFixed(0)}</div>
              <div className="admin-stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">{users.filter((u) => u.role === "user").length}</div>
              <div className="admin-stat-label">Students</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon yellow">
              <i className="fas fa-clock"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">{pendingOrders}</div>
              <div className="admin-stat-label">Active Orders</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <i className="fas fa-star"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">{avgRating}</div>
              <div className="admin-stat-label">Avg Rating</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon red">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-number">{menuItems.length}</div>
              <div className="admin-stat-label">Menu Items</div>
            </div>
          </div>
        </div>

        <div className="admin-grid">
          {/* Chart */}
          <div className="admin-card">
            <h3 className="admin-card-title">Orders by Status</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Quick Actions */}
          <div className="admin-card">
            <h3 className="admin-card-title">Quick Actions</h3>
            <div className="admin-quick-actions">
              <Link to="/admin/menu" className="admin-action-card">
                <i className="fas fa-utensils"></i>
                <span>Manage Menu</span>
              </Link>
              <Link to="/admin/orders" className="admin-action-card">
                <i className="fas fa-receipt"></i>
                <span>View Orders</span>
              </Link>
              <Link to="/admin/feedback" className="admin-action-card">
                <i className="fas fa-comments"></i>
                <span>Feedback</span>
              </Link>
              <Link to="/admin/payments" className="admin-action-card">
                <i className="fas fa-credit-card"></i>
                <span>Payments</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Orders</h3>
            <Link to="/admin/orders" className="admin-view-all">View all</Link>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Student</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="order-id-cell">#{order.orderId.slice(-6).toUpperCase()}</td>
                    <td>{order.userName || "—"}</td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td className="price-cell">₹{order.totalPrice}</td>
                    <td>
                      <span className={`status-${order.orderStatus || "pending"}`}>
                        {order.orderStatus || "pending"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {order.orderTime?.toDate
                        ? order.orderTime.toDate().toLocaleDateString()
                        : order.orderTime
                        ? new Date(order.orderTime).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
