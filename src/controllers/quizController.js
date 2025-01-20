const quizService = require("../services/quizService");

// Create Quiz
const createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// Get Quiz by Course
const getQuizByCourse = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizByCourse(req.params.courseId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Exclude correctAnswer for users
    quiz.questions = quiz.questions.map((q) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      options: q.options,
      _id: q._id,
    }));
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// Get all quizzes (Admin)
const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.status(200).json({
      success: true,
      message: "Quizzes retrieved successfully",
      data: quizzes,
    });
  } catch (err) {
    next(err);
  }
};

// Update a quiz (Admin)
const updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const updatedQuiz = await quizService.updateQuiz(quizId, req.body);
    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (err) {
    if (err.message === "Quiz not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const deleted = await quizService.deleteQuiz(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuiz,
  getQuizByCourse,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
};
