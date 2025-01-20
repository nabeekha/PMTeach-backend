const express = require("express");
const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createQuiz);
router.get("/:courseId", authMiddleware, getQuizByCourse);
router.get("/", authMiddleware, adminMiddleware, getAllQuizzes);
router.put("/:id", authMiddleware, adminMiddleware, updateQuiz);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuiz);
module.exports = router;
