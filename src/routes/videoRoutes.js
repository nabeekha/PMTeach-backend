const express = require("express");
const {
  createVideo,
  getVideosBySection,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createVideo);
router.get("/:sectionId", authMiddleware, getVideosBySection);
router.get("/video/:id", authMiddleware, getVideoById);
router.put("/:id", authMiddleware, adminMiddleware, updateVideo);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVideo);

module.exports = router;
