const express = require("express");
const {
  createLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  updateLiveSession,
  deleteLiveSession,
  registerUserForSession,
} = require("./liveSession.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authMiddleware, registerUserForSession);
router.post("/", authMiddleware, adminMiddleware, createLiveSession);
router.get("/", getAllLiveSessions);
router.get("/:id", getLiveSessionById);
router.put("/:id", authMiddleware, adminMiddleware, updateLiveSession);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLiveSession);

module.exports = router;
