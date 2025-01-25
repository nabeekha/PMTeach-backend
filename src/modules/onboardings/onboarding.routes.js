const express = require("express");
const router = express.Router();
const {
  completeOnboarding,
  getOnboarding,
  updateOnboarding,
  deleteOnboarding,
} = require("./onboarding.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

// Create or complete onboarding (POST)
router.post("/", authMiddleware, completeOnboarding);

// Get onboarding data (GET)
router.get("/", authMiddleware, getOnboarding);

// Update onboarding data (PUT)
router.put("/:id", authMiddleware, updateOnboarding);

// Delete onboarding data (DELETE)
router.delete("/:id", authMiddleware, adminMiddleware, deleteOnboarding);

module.exports = router;
