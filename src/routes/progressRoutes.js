const express = require("express");
const {
  getUserProgress,
  updateProgress,
} = require("../controllers/progressController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", authMiddleware, getUserProgress);

router.post("/update", authMiddleware, updateProgress);

module.exports = router;
