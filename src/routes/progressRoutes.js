const express = require("express");
const {
  markVideoAsCompleted,
  getProgressByUser,
  getProgressByCourse,
} = require("../controllers/progressController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, markVideoAsCompleted);
router.get("/user", authMiddleware, getProgressByUser);
router.get("/course/:courseId", authMiddleware, getProgressByCourse);

module.exports = router;
