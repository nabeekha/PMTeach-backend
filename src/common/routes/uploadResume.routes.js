const express = require("express");
const multer = require("multer");
const {
  uploadResumeAndRecommend,
} = require("../controllers/uploadResume.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route for uploading resume and getting recommendations
router.post("/", upload.single("resume"), uploadResumeAndRecommend);

module.exports = router;
