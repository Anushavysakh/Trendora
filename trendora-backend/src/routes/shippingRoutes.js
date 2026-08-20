const express = require("express");

const {
  calculateShipping,
} = require("../controllers/shippingController");

const router = express.Router();

router.post(
  "/calculate",
  calculateShipping
);

module.exports = router;