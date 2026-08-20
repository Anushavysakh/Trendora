const express = require("express");

const {
  getAllReviews,
  getReviews,
  addReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getAllReviews);
router.get("/:productId", getReviews);

// Customer
router.post("/", protect, addReview);

// Admin
router.delete("/:id", protect, admin, deleteReview);

module.exports = router;