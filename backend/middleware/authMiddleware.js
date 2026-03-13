const { auth } = require("../models/firebase");

/**
 * Middleware to verify Firebase ID token from Authorization header.
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

/**
 * Middleware to verify admin role (requires verifyToken first).
 */
async function verifyAdmin(req, res, next) {
  const { db } = require("../models/firebase");
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { verifyToken, verifyAdmin };
