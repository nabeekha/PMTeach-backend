const express = require("express");
const {
  createQuiz,
  getQuizByCourseAndSection,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getQuizById,
} = require("./quiz.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createQuiz);
router.get("/:courseId/:sectionId", authMiddleware, getQuizByCourseAndSection);
router.get("/:id", authMiddleware, adminMiddleware, getQuizById);
router.get("/", authMiddleware, adminMiddleware, getAllQuizzes);
router.put("/:id", authMiddleware, adminMiddleware, updateQuiz);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuiz);
module.exports = router;
