import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../services/firestoreService";
import { getMenuItems } from "../../services/firestoreService";
import { getRecommendations, getTimeSuggestion } from "../../services/recommendationService";
import MenuCard from "../../components/MenuCard/MenuCard";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./UserDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function UserDashboard() {
  const { userProfile, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, menuData] = await Promise.all([
          getUserOrders(currentUser.uid),
          getMenuItems(),
        ]);
        setOrders(ordersData);
        setRecommendations(getRecommendations(menuData, ordersData));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  // Budget data for current month
  const now = new Date();
  const monthOrders = orders.filter((o) => {
    if (!o.orderTime) return false;
    const d = o.orderTime.toDate ? o.orderTime.toDate() : new Date(o.orderTime);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthTotal = monthOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const budget = 1500;
  const remaining = Math.max(0, budget - monthTotal);

  const recentOrders = orders.slice(0, 3);

  const chartData = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [monthTotal, remaining],
        backgroundColor: ["#ff6b35", "#e8e8e8"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  function getStatusBadge(status) {
    return <span className={`status-${status || "pending"}`}>{status || "pending"}</span>;
  }

  if (loading) return <Spinner message="Loading dashboard..." />;

  return (
    <div className="dashboard-page page-wrapper">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div>
            <h1 className="welcome-title">
              Hello, {userProfile?.name?.split(" ")[0]} 👋
            </h1>
            <p className="welcome-subtitle">{getTimeSuggestion()}</p>
          </div>
          <Link to="/menu" className="btn-order-now">
            Order Now <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      <div className="dashboard-container">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon bg-orange">
              <i className="fas fa-receipt"></i>
            </div>
            <div>
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <div className="stat-value">
                {orders.filter((o) => o.orderStatus === "delivered").length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-blue">
              <i className="fas fa-wallet"></i>
            </div>
            <div>
              <div className="stat-value">₹{monthTotal}</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-purple">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div className="stat-value">
                {orders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "preparing").length}
              </div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Recent Orders</h3>
              <Link to="/orders" className="view-all-link">View all</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>No orders yet. Start ordering!</p>
                <Link to="/menu" className="btn-start-order">Browse Menu</Link>
              </div>
            ) : (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order.orderId} className="order-item-card">
                    <div className="order-item-left">
                      <div className="order-id">#{order.orderId.slice(-6).toUpperCase()}</div>
                      <div className="order-items-count">
                        {order.items?.length || 0} item(s)
                      </div>
                      <div className="order-date">
                        {order.orderTime?.toDate
                          ? order.orderTime.toDate().toLocaleDateString()
                          : order.orderTime
                          ? new Date(order.orderTime).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>
                    <div className="order-item-right">
                      {getStatusBadge(order.orderStatus)}
                      <div className="order-price">₹{order.totalPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget Tracker */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Monthly Budget</h3>
              <span className="budget-month">
                {now.toLocaleString("default", { month: "long" })}
              </span>
            </div>
            <div className="budget-chart-container">
              <div className="chart-wrapper">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="chart-center-text">
                  <div className="chart-amount">₹{monthTotal}</div>
                  <div className="chart-label">Spent</div>
                </div>
              </div>
              <div className="budget-details">
                <div className="budget-item">
                  <span className="budget-dot spent"></span>
                  <span>Spent: ₹{monthTotal}</span>
                </div>
                <div className="budget-item">
                  <span className="budget-dot remaining"></span>
                  <span>Remaining: ₹{remaining}</span>
                </div>
                <div className="budget-item total">
                  <span>Budget: ₹{budget}</span>
                </div>
                <div className="budget-bar-wrapper">
                  <div
                    className="budget-bar-fill"
                    style={{ width: `${Math.min((monthTotal / budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="budget-percent">
                  {Math.round((monthTotal / budget) * 100)}% used
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <div className="section-header">
              <h3>🤖 Recommended for You</h3>
              <span className="ai-badge">AI Powered</span>
            </div>
            <div className="recommendations-grid">
              {recommendations.map((item) => (
                <MenuCard key={item.itemId} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/menu" className="action-card">
              <i className="fas fa-utensils"></i>
              <span>Browse Menu</span>
            </Link>
            <Link to="/cart" className="action-card">
              <i className="fas fa-shopping-cart"></i>
              <span>View Cart</span>
            </Link>
            <Link to="/orders" className="action-card">
              <i className="fas fa-list-alt"></i>
              <span>My Orders</span>
            </Link>
            <Link to="/feedback" className="action-card">
              <i className="fas fa-star"></i>
              <span>Feedback</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard;
