const Course = require("../models/courseModel");

const createCourse = async (data) => {
  const course = new Course(data);
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find({});
};

const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found.");
  return course;
};

const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, { new: true });
  if (!course) throw new Error("Course not found.");
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new Error("Course not found.");
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
