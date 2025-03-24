const express = require("express");
const router = express.Router();
const {
  getCareerGoals,
  getCareerGoalById,
  addCareerGoal,
  updateCareerGoal,
  deleteCareerGoal,
} = require("./careerGoal.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware");

// Get all career goals
router.get("/", getCareerGoals);

// Get a single career goal by ID
router.get("/:id", authMiddleware, getCareerGoalById);

// Add a new career goal (requires authentication and admin role)
router.post("/", authMiddleware, adminMiddleware, addCareerGoal);

// Update a career goal by ID (requires authentication and admin role)
router.put("/:id", authMiddleware, adminMiddleware, updateCareerGoal);

// Delete a career goal by ID (requires authentication and admin role)
router.delete("/:id", authMiddleware, adminMiddleware, deleteCareerGoal);

module.exports = router;
