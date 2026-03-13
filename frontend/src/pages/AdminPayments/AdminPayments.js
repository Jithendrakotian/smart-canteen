import React, { useState, useEffect } from "react";
import { getAllPayments } from "../../services/firestoreService";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./AdminPayments.css";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllPayments()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "completed")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.paymentStatus === filter);

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const methodLabels = {
    upi: "UPI / Google Pay",
    card: "Debit / Credit Card",
    netbanking: "Net Banking",
    cash: "Pay at Counter",
  };

  if (loading) return <Spinner message="Loading payments..." />;

  return (
    <div className="admin-payments-page page-wrapper">
      <div className="admin-payments-container">
        <h1 className="admin-payments-title">Payment Records 💳</h1>

        {/* Summary */}
        <div className="payments-summary">
          <div className="payment-stat">
            <div className="payment-stat-number">₹{totalRevenue.toFixed(2)}</div>
            <div className="payment-stat-label">Total Revenue</div>
          </div>
          <div className="payment-stat">
            <div className="payment-stat-number">{payments.length}</div>
            <div className="payment-stat-label">Total Transactions</div>
          </div>
          <div className="payment-stat">
            <div className="payment-stat-number">
              {payments.filter((p) => p.paymentStatus === "completed").length}
            </div>
            <div className="payment-stat-label">Completed</div>
          </div>
        </div>

        {/* Filter */}
        <div className="payments-filter">
          {["all", "completed", "pending", "failed"].map((s) => (
            <button
              key={s}
              className={`payment-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="payments-empty">
            <div style={{ fontSize: "3rem" }}>💸</div>
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.paymentId}>
                    <td className="payment-id-cell">#{p.paymentId.slice(-8).toUpperCase()}</td>
                    <td className="payment-id-cell">#{p.orderId?.slice(-6).toUpperCase() || "—"}</td>
                    <td className="payment-amount-cell">₹{p.amount?.toFixed(2)}</td>
                    <td>{methodLabels[p.paymentMethod] || p.paymentMethod}</td>
                    <td>
                      <span className={`payment-status-badge status-${p.paymentStatus}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="payment-date-cell">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminPayments;
