import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { submitFeedback, getUserFeedback } from "../../services/firestoreService";
import StarRating from "../../components/StarRating/StarRating";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./Feedback.css";

function Feedback() {
  const { currentUser, userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("food");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    getUserFeedback(currentUser.uid)
      .then(setFeedbackHistory)
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, [currentUser, submitted]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating.");
    setLoading(true);
    try {
      await submitFeedback({
        userId: currentUser.uid,
        userName: userProfile?.name,
        rating,
        comment,
        category,
      });
      setSubmitted(true);
      setRating(0);
      setComment("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="feedback-page page-wrapper">
      <div className="feedback-container">
        <h1 className="feedback-title">Feedback & Ratings ⭐</h1>
        <p className="feedback-subtitle">Help us improve by sharing your experience</p>

        <div className="feedback-layout">
          {/* Submit Feedback */}
          <div className="feedback-form-card">
            {submitted && (
              <div className="feedback-success">
                🎉 Thank you for your feedback!
              </div>
            )}

            <h3 className="form-card-title">Share Your Experience</h3>

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select-custom"
                >
                  <option value="food">Food Quality</option>
                  <option value="service">Service</option>
                  <option value="hygiene">Hygiene</option>
                  <option value="app">App Experience</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Your Rating</label>
                <StarRating rating={rating} onRate={setRating} />
                <div className="rating-hint">
                  {rating === 0 && "Select a rating"}
                  {rating === 1 && "😕 Poor"}
                  {rating === 2 && "😐 Fair"}
                  {rating === 3 && "🙂 Good"}
                  {rating === 4 && "😊 Very Good"}
                  {rating === 5 && "🤩 Excellent!"}
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Your Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what you liked or how we can improve..."
                  rows={4}
                  className="form-textarea-custom"
                />
              </div>

              <button type="submit" className="btn-submit-feedback" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback 🚀"}
              </button>
            </form>
          </div>

          {/* My Feedback History */}
          <div className="feedback-history-card">
            <h3 className="form-card-title">My Feedback History</h3>
            {historyLoading ? (
              <Spinner message="Loading..." />
            ) : feedbackHistory.length === 0 ? (
              <div className="feedback-empty">
                <div style={{ fontSize: "2.5rem" }}>📝</div>
                <p>No feedback submitted yet.</p>
              </div>
            ) : (
              <div className="feedback-history-list">
                {feedbackHistory.map((fb) => (
                  <div key={fb.feedbackId} className="feedback-history-item">
                    <div className="fb-item-header">
                      <span className="fb-category">{fb.category}</span>
                      <span className="fb-date">{formatDate(fb.date)}</span>
                    </div>
                    <StarRating rating={fb.rating} readOnly />
                    {fb.comment && <p className="fb-comment">"{fb.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Feedback;
