const Quiz = require("../quizzes/quiz.model");
const QuizHistory = require("./quizHistory.model");
const paginate = require("../../utils/pagination");

const submitQuiz = async (userId, quizId, courseId, sectionId, answers) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  let correctAnswers = 0;
  let incorrectAnswers = 0;

  const results = quiz.questions.map((question, index) => {
    const selectedAnswer = answers.find(
      (a) => a.questionId === question._id.toString()
    );
    if (selectedAnswer?.selectedAnswer === question.correctAnswer) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
    return {
      questionId: question._id,
      selectedAnswer: selectedAnswer?.selectedAnswer,
    };
  });

  const totalScore = correctAnswers;
  const history = new QuizHistory({
    userId,
    quizId,
    courseId,
    sectionId,
    selectedAnswers: results,
    correctAnswers,
    incorrectAnswers,
    totalScore,
  });

  return await history.save();
};

const getAllHistories = async (query, page, limit) => {
  const paginationResult = await paginate(QuizHistory, query, page, limit);
  const paginationData =
    !page && !limit ? paginationResult : paginationResult.data;
  const quizHistoryData = await QuizHistory.populate(paginationData, [
    { path: "quizId" },
    { path: "userId" },
    { path: "sectionId", select: "title" },
    { path: "courseId", select: "title" },
  ]);
  if (!page && !limit) {
    return quizHistoryData;
  } else {
    return {
      total: paginationResult.total,
      page: paginationResult.page,
      pages: paginationResult.pages,
      data: quizHistoryData,
    };
  }
};

const getHistoryByUser = async (userId) => {
  return await QuizHistory.find({ userId })
    .populate("quizId")
    .sort({ createdAt: -1 });
};

module.exports = {
  submitQuiz,
  getAllHistories,
  getHistoryByUser,
};
