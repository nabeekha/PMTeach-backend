const courseService = require("../services/courseService");
const { validateCourse } = require("../utils/validation");

const createCourse = async (req, res, next) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await courseService.updateCourse(
      req.params.id,
      req.body
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const deleted = await courseService.deleteCourse(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
