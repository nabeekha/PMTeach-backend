const express = require("express");
const router = express.Router();
const {
  getMilestones,
  getMilestoneById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestoneController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Get milestones
router.get("/", authMiddleware, getMilestones);

// Get a single milestone by ID
router.get("/:id", authMiddleware, getMilestoneById);

// Add a new milestone (requires authentication and admin role)
router.post("/", authMiddleware, adminMiddleware, addMilestone);

// Update a milestone by ID (requires authentication and admin role)
router.put("/:id", authMiddleware, adminMiddleware, updateMilestone);

// Delete a milestone by ID (requires authentication and admin role)
router.delete("/:id", authMiddleware, adminMiddleware, deleteMilestone);

module.exports = router;
