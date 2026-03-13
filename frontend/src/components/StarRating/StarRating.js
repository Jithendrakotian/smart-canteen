import React from "react";
import "./StarRating.css";

function StarRating({ rating, onRate, readOnly = false }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""} ${readOnly ? "readonly" : "clickable"}`}
          onClick={() => !readOnly && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
