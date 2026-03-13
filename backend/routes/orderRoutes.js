const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/my", verifyToken, getMyOrders);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.post("/", verifyToken, createOrder);
router.patch("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
