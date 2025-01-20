const QuizHistory = require("../models/quizHistoryModal");
const quizHistoryService = require("../services/quizHistoryService");

// Submit Quiz
const submitQuiz = async (req, res, next) => {
  try {
    const { userId, quizId, courseId, answers } = req.body;

    const existingHistory = await QuizHistory.findOne({
      userId,
      quizId,
      courseId,
    });
    if (existingHistory) {
      return res
        .status(400)
        .json({ message: "You have already submitted this quiz." });
    }

    const history = await quizHistoryService.submitQuiz(
      userId,
      quizId,
      courseId,
      answers
    );
    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// Get all quiz histories (Admin)
const getQuizHistory = async (req, res, next) => {
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };

  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }

    const histories = await quizHistoryService.getAllHistories(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );
    let response = {
      success: true,
      message: "Histories retrieved successfully",
      data: !page && !limit ? histories : histories.data,
    };
    if (histories.total) {
      response.totalItems = histories.total;
      response.pageNumber = Number(histories.page);
      response.totalPages = histories.pages;
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// Get quiz history by userId
const getQuizHistoryByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const histories = await quizHistoryService.getHistoryByUser(userId);
    res.status(200).json({
      success: true,
      data: histories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuiz,
  getQuizHistory,
  getQuizHistoryByUser,
};
