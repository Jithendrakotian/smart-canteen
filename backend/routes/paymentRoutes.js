const express = require("express");
const router = express.Router();
const { createPayment, getAllPayments } = require("../controllers/paymentController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createPayment);
router.get("/", verifyToken, verifyAdmin, getAllPayments);

module.exports = router;
