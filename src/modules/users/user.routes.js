const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  createOrRetrieveUser,
  updateUser,
  deleteUser,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../users/user.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// Get all users (Admin only)
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// Get user by ID (Admin only)
router.get("/:id", authMiddleware, adminMiddleware, getUserById);

// Create or retrieve user
router.post("/google-auth", createOrRetrieveUser);

// Update user by ID
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

// Delete user by ID
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// send otp
router.post("/resend-otp", resendOtp);

// verify otp
router.post("/verify-otp", verifyOtp);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

// Change password
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
