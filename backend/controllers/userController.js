const { db } = require("../models/firebase");
const admin = require("firebase-admin");

// GET /api/users - Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((d) => ({ userId: d.id, ...d.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/users/me - Get current user profile
async function getMyProfile(req, res) {
  try {
    const docSnap = await db.collection("users").doc(req.user.uid).get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ userId: docSnap.id, ...docSnap.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllUsers, getMyProfile };
