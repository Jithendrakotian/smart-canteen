const express = require("express");
const router = express.Router();
const { submitFeedback, getAllFeedback, getMyFeedback } = require("../controllers/feedbackController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, submitFeedback);
router.get("/my", verifyToken, getMyFeedback);
router.get("/", verifyToken, verifyAdmin, getAllFeedback);

module.exports = router;
