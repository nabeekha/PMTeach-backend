const quizService = require("./quiz.service");

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
const getQuizByCourseAndSection = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizByCourseAndSection(
      req.params.courseId,
      req.params.sectionId
    );
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
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };

  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }
    if (search) {
      query.$or = [{ quizTitle: { $regex: search, $options: "i" } }];
    }
    const quizzes = await quizService.getAllQuizzes(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );
    let response = {
      success: true,
      message: "Quizzes retrieved successfully",
      data: !page && !limit ? quizzes : quizzes.data,
    };
    if (quizzes.total) {
      response.totalItems = quizzes.total;
      response.pageNumber = Number(quizzes.page);
      response.totalPages = quizzes.pages;
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz,
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
  getQuizByCourseAndSection,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getQuizById,
};
