const express = require("express");
const router = express.Router();
const { getAllUsers, getMyProfile } = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/me", verifyToken, getMyProfile);
router.get("/", verifyToken, verifyAdmin, getAllUsers);

module.exports = router;
