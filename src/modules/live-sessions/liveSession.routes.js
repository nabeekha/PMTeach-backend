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

router.post("/", authMiddleware, adminMiddleware, createLiveSession);
router.get("/", getAllLiveSessions);
router.get("/:id", authMiddleware, getLiveSessionById);
router.put("/:id", authMiddleware, adminMiddleware, updateLiveSession);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLiveSession);
router.post("/register", authMiddleware, registerUserForSession);

module.exports = router;
