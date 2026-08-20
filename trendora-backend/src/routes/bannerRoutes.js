const express = require("express");

const {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const multer = require("multer");

const router = express.Router();


// Temporary local upload
const upload = multer({
  dest: "uploads/banners/",
});


// PUBLIC
// Get active banners for homepage
router.get("/active", getActiveBanners);


// ADMIN
// Get all banners
router.get(
  "/",
  protect,
  admin,
  getBanners
);


// Create banner
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createBanner
);


// Update banner
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateBanner
);


// Delete banner
router.delete(
  "/:id",
  protect,
  admin,
  deleteBanner
);


module.exports = router;