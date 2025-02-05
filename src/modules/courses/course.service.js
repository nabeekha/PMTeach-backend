const Course = require("./course.model");
const paginate = require("../../utils/pagination");

const createCourse = async (data) => {
  const course = new Course(data);
  return await course.save();
};

const getAllCourses = async (query, page, limit) => {
  return await paginate(Course, query, page, limit);
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
  return await Course.findByIdAndDelete(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
