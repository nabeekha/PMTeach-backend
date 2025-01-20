const Quiz = require("../models/quizModal");

const createQuiz = async (data) => {
  const { courseId } = data;
  const existingQuiz = await Quiz.findOne({ courseId });
  if (existingQuiz) {
    throw new Error("A quiz already exists for this course.");
  }
  const quiz = new Quiz(data);
  return await quiz.save();
};

const getQuizByCourse = async (courseId) => {
  return await Quiz.findOne({ courseId }).select("-__v");
};

const getAllQuizzes = async () => {
  return await Quiz.find().populate("courseId", "title description");
};

const updateQuiz = async (id, data) => {
  const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return quiz;
};

const deleteQuiz = async (id) => {
  return await Quiz.findByIdAndDelete(id);
};

module.exports = {
  createQuiz,
  getQuizByCourse,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
};
