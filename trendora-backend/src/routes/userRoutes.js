const express = require("express");



const {
  registerUser,
  loginUser,
  googleLogin,
  getUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

// Admin
router.get("/", protect, admin, getUsers);
router.put("/:id/block", protect, admin, toggleBlockUser);
router.delete("/:id", protect, admin, deleteUser);


module.exports = router;