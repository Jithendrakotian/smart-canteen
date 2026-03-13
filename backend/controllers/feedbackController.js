const { db } = require("../models/firebase");
const admin = require("firebase-admin");

// POST /api/feedback - Submit feedback
async function submitFeedback(req, res) {
  try {
    const { rating, comment, category } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const docRef = await db.collection("feedback").add({
      userId: req.user.uid,
      userName: req.user.name || "",
      rating: Number(rating),
      comment: comment || "",
      category: category || "general",
      date: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ feedbackId: docRef.id, message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/feedback - Get all feedback (admin only)
async function getAllFeedback(req, res) {
  try {
    const snapshot = await db.collection("feedback").orderBy("date", "desc").get();
    const feedback = snapshot.docs.map((d) => ({ feedbackId: d.id, ...d.data() }));
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/feedback/my - Get current user's feedback
async function getMyFeedback(req, res) {
  try {
    const snapshot = await db
      .collection("feedback")
      .where("userId", "==", req.user.uid)
      .get();
    const feedback = snapshot.docs.map((d) => ({ feedbackId: d.id, ...d.data() }));
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { submitFeedback, getAllFeedback, getMyFeedback };
