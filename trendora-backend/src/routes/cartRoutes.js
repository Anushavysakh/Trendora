const express = require("express");

const {
  getCart,
  addToCart,
  updateQty,
  removeFromCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateQty);
router.delete("/", protect, removeFromCart);

module.exports = router;