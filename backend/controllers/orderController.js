const { db } = require("../models/firebase");
const admin = require("firebase-admin");

// POST /api/orders - Create a new order
async function createOrder(req, res) {
  try {
    const { items, totalPrice, note } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }
    const docRef = await db.collection("orders").add({
      userId: req.user.uid,
      userName: req.user.name || "",
      items,
      totalPrice: Number(totalPrice) || 0,
      note: note || "",
      orderStatus: "pending",
      orderTime: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ orderId: docRef.id, message: "Order placed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/orders/my - Get current user's orders
async function getMyOrders(req, res) {
  try {
    const snapshot = await db
      .collection("orders")
      .where("userId", "==", req.user.uid)
      .orderBy("orderTime", "desc")
      .get();
    const orders = snapshot.docs.map((d) => ({ orderId: d.id, ...d.data() }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/orders - Get all orders (admin only)
async function getAllOrders(req, res) {
  try {
    const snapshot = await db.collection("orders").orderBy("orderTime", "desc").get();
    const orders = snapshot.docs.map((d) => ({ orderId: d.id, ...d.data() }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/orders/:id/status - Update order status (admin only)
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: "Invalid order status" });
    }
    await db.collection("orders").doc(id).update({ orderStatus });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
