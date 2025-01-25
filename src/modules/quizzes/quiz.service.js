const Quiz = require("./quiz.model");
const paginate = require("../../utils/pagination");

const createQuiz = async (data) => {
  const { courseId } = data;
  const existingQuiz = await Quiz.findOne({ courseId });
  if (existingQuiz) {
    throw new Error("A quiz already exists for this course.");
  }
  const quiz = new Quiz(data);
  return await quiz.save();
};

const getQuizByCourse = async (courseId, sectionId) => {
  return await Quiz.findOne({ courseId, sectionId }).select("-__v");
};

const getAllQuizzes = async (query, page, limit) => {
  const paginationResult = await paginate(Quiz, query, page, limit);
  const paginationData =
    !page && !limit ? paginationResult : paginationResult.data;
  const quiData = await Quiz.populate(paginationData, [
    { path: "sectionId", select: "title" },
    { path: "courseId", select: "title" },
  ]);
  if (!page && !limit) {
    return quiData;
  } else {
    return {
      total: paginationResult.total,
      page: paginationResult.page,
      pages: paginationResult.pages,
      data: quiData,
    };
  }
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
