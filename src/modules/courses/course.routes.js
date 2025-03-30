const express = require("express");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("./course.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCourse);
router.get("/", getAllCourses);
router.get("/:id", authMiddleware, getCourseById);
router.put("/:id", authMiddleware, adminMiddleware, updateCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourse);

module.exports = router;
