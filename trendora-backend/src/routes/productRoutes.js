const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  searchProducts,
} = require("../controllers/productController");
const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/search", searchProducts);

router.get("/:id", getProductById);

// Admin Routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);


module.exports = router;