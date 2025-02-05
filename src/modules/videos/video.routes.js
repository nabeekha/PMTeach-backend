const express = require("express");
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("./video.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createVideo);
router.get("/", authMiddleware, getVideos);
router.get("/video/:id", authMiddleware, getVideoById);
router.put("/:id", authMiddleware, adminMiddleware, updateVideo);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVideo);

module.exports = router;
