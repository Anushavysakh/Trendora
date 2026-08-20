const express = require("express");

const {
  getDashboard,
  getMonthlySales,
  getOrderStatusAnalytics
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, admin, getDashboard);

router.get("/monthly-sales", protect, admin, getMonthlySales);

router.get("/order-status", protect, admin, getOrderStatusAnalytics);

module.exports = router;


