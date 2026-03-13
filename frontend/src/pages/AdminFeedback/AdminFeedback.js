import React, { useState, useEffect } from "react";
import { getAllFeedback } from "../../services/firestoreService";
import StarRating from "../../components/StarRating/StarRating";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./AdminFeedback.css";

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllFeedback()
      .then(setFeedback)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : "—";

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedback.filter((f) => f.rating === r).length,
  }));

  const filtered = filter === "all" ? feedback : feedback.filter((f) => f.category === filter);

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  if (loading) return <Spinner message="Loading feedback..." />;

  return (
    <div className="admin-feedback-page page-wrapper">
      <div className="admin-feedback-container">
        <h1 className="admin-feedback-title">Student Feedback 💬</h1>

        {/* Summary */}
        <div className="feedback-summary">
          <div className="feedback-avg-card">
            <div className="avg-number">{avgRating}</div>
            <StarRating rating={Math.round(Number(avgRating) || 0)} readOnly />
            <div className="avg-count">{feedback.length} reviews</div>
          </div>
          <div className="rating-breakdown">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="rating-bar-row">
                <span className="rating-star-label">{rating}★</span>
                <div className="rating-bar-track">
                  <div
                    className="rating-bar-fill"
                    style={{ width: feedback.length ? `${(count / feedback.length) * 100}%` : "0%" }}
                  ></div>
                </div>
                <span className="rating-count-label">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="feedback-category-filters">
          {["all", "food", "service", "hygiene", "app", "general"].map((c) => (
            <button
              key={c}
              className={`feedback-filter-btn ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Feedback Cards */}
        {filtered.length === 0 ? (
          <div className="feedback-admin-empty">
            <div style={{ fontSize: "3rem" }}>😶</div>
            <p>No feedback found.</p>
          </div>
        ) : (
          <div className="feedback-admin-grid">
            {filtered.map((fb) => (
              <div key={fb.feedbackId} className="feedback-admin-card">
                <div className="fb-card-header">
                  <div className="fb-user-avatar">{fb.userName?.charAt(0) || "?"}</div>
                  <div>
                    <div className="fb-user-name">{fb.userName || "Anonymous"}</div>
                    <div className="fb-date">{formatDate(fb.date)}</div>
                  </div>
                  <span className="fb-category-badge">{fb.category}</span>
                </div>
                <StarRating rating={fb.rating} readOnly />
                {fb.comment && <p className="fb-comment-text">"{fb.comment}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminFeedback;
