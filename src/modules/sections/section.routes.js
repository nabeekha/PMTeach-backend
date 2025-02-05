const express = require("express");
const {
  createSection,
  getSections,
  updateSection,
  deleteSection,
} = require("./section.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createSection);
router.get("/", authMiddleware, getSections);
router.put("/:id", authMiddleware, adminMiddleware, updateSection);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSection);

module.exports = router;
