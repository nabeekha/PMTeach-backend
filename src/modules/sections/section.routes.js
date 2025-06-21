const express = require("express");
const {
  createSection,
  getSections,
  updateSection,
  deleteSection,
  getSectionById,
} = require("./section.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createSection);
router.get("/", getSections);
router.get("/:id", authMiddleware, adminMiddleware, getSectionById);
router.put("/:id", authMiddleware, adminMiddleware, updateSection);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSection);

module.exports = router;
