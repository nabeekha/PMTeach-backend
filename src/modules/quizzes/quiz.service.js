const Quiz = require("./quiz.model");
const paginate = require("../../utils/pagination");

const createQuiz = async (data) => {
  const { courseId, sectionId } = data;
  const existingQuiz = await Quiz.findOne({ courseId, sectionId });
  if (existingQuiz) {
    throw new Error("A quiz already exists for this course and sections.");
  }
  const quiz = new Quiz(data);
  return await quiz.save();
};

const getQuizByCourseAndSection = async (courseId, sectionId) => {
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

const getQuizById = async (id) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new Error("Quiz not found.");
  return quiz;
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
  getQuizByCourseAndSection,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getQuizById,
};
