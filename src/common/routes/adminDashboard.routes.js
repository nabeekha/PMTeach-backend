const express = require("express");
const router = express.Router();
const {
  getAdminDashboardData,
} = require("../../common/controllers/adminDashboard.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, adminMiddleware, getAdminDashboardData);

module.exports = router;
