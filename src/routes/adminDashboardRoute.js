const express = require("express");
const router = express.Router();
const {
  getAdminDashboardData,
} = require("../controllers/adminDashboardController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");

router.get("/", authMiddleware, adminMiddleware, getAdminDashboardData);

module.exports = router;
