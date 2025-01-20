const express = require("express");
const {
  submitQuiz,
  getQuizHistory,
  getQuizHistoryByUser,
} = require("../controllers/quizHistoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitQuiz); // Submit quiz
router.get("/", authMiddleware, getQuizHistory); // Get all quiz histories (admin)
router.get("/user/:userId", authMiddleware, getQuizHistoryByUser); // Get user-specific history

module.exports = router;
