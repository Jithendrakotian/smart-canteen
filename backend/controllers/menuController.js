const { db } = require("../models/firebase");
const admin = require("firebase-admin");

// GET /api/menu - List all menu items
async function getMenu(req, res) {
  try {
    const snapshot = await db.collection("menu").get();
    const items = snapshot.docs.map((doc) => ({ itemId: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/menu - Add a new item (admin only)
async function addMenuItem(req, res) {
  try {
    const { itemName, description, price, category, imageURL, available } = req.body;
    if (!itemName || price === undefined) {
      return res.status(400).json({ error: "itemName and price are required" });
    }
    const docRef = await db.collection("menu").add({
      itemName,
      description: description || "",
      price: Number(price),
      category: category || "General",
      imageURL: imageURL || "",
      available: available !== false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ itemId: docRef.id, message: "Item added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/menu/:id - Update a menu item (admin only)
async function updateMenuItem(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    await db.collection("menu").doc(id).update(updates);
    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/menu/:id - Delete a menu item (admin only)
async function deleteMenuItem(req, res) {
  try {
    const { id } = req.params;
    await db.collection("menu").doc(id).delete();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
