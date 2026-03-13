const { db } = require("../models/firebase");
const admin = require("firebase-admin");

// POST /api/payments - Record a payment
async function createPayment(req, res) {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    if (!orderId || amount === undefined) {
      return res.status(400).json({ error: "orderId and amount are required" });
    }
    const docRef = await db.collection("payments").add({
      orderId,
      userId: req.user.uid,
      amount: Number(amount),
      paymentMethod: paymentMethod || "upi",
      paymentStatus: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ paymentId: docRef.id, message: "Payment recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/payments - Get all payments (admin only)
async function getAllPayments(req, res) {
  try {
    const snapshot = await db.collection("payments").orderBy("createdAt", "desc").get();
    const payments = snapshot.docs.map((d) => ({ paymentId: d.id, ...d.data() }));
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPayment, getAllPayments };
