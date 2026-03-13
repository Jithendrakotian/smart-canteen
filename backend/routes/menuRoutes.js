const express = require("express");
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", getMenu);
router.post("/", verifyToken, verifyAdmin, addMenuItem);
router.put("/:id", verifyToken, verifyAdmin, updateMenuItem);
router.delete("/:id", verifyToken, verifyAdmin, deleteMenuItem);

module.exports = router;
