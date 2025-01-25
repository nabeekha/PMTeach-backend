const express = require("express");
const {
  submitQuiz,
  getQuizHistory,
  getQuizHistoryByUser,
} = require("./quizHistory.controller");
const { authMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitQuiz);
router.get("/", authMiddleware, getQuizHistory);
router.get("/user/:userId", authMiddleware, getQuizHistoryByUser);

module.exports = router;
