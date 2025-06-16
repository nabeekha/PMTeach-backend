const questionBankService = require("./questionBank.service");

// Get all question banks
exports.getAllQuestionBanks = async (req, res, next) => {
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };
  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }
    if (search) {
      query.$or = [
        { interViewBankName: { $regex: search, $options: "i" } },
        { interViewBankTitle: { $regex: search, $options: "i" } },
        { interViewBankDescription: { $regex: search, $options: "i" } },
      ];
    }

    const questionBanks = await questionBankService.getAllQuestionBanks(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    let response = {
      success: true,
      message: "Question Banks retrieved successfully",
      data: !page && !limit ? questionBanks : questionBanks.data,
    };

    if (questionBanks.total) {
      response.totalItems = questionBanks.total;
      response.pageNumber = Number(questionBanks.page);
      response.totalPages = questionBanks.pages;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getQuestionBanks = async (req, res, next) => {
  try {
    const questionBanks = await questionBankService.getQuestionBanks();
    res.status(200).json({
      success: true,
      message: "Question bank retrieved successfully",
      data: questionBanks,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single question bank by ID
exports.getQuestionBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const questionBank = await questionBankService.getQuestionBankById(id);
    if (!questionBank) {
      return res
        .status(404)
        .json({ success: false, message: "Question bank not found" });
    }
    res.status(200).json({
      success: true,
      message: "Question bank retrieved successfully",
      data: questionBank,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new question bank
exports.addQuestionBank = async (req, res) => {
  try {
    const questionBank = await questionBankService.addQuestionBank(req.body);
    res.status(201).json({
      success: true,
      message: "Question bank added successfully",
      data: questionBank,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a question bank by ID
exports.updateQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestionBank = await questionBankService.updateQuestionBank(
      id,
      req.body
    );
    if (!updatedQuestionBank) {
      return res
        .status(404)
        .json({ success: false, message: "Question bank not found" });
    }
    res.status(200).json({
      success: true,
      message: "Question bank updated successfully",
      data: updatedQuestionBank,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a question bank by ID
exports.deleteQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestionBank = await questionBankService.deleteQuestionBank(
      id
    );
    if (!deletedQuestionBank) {
      return res
        .status(404)
        .json({ success: false, message: "Question bank not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Question bank deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get categories for a specific question bank
exports.getBankCategories = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await questionBankService.getCategoriesByBankSlug(slug);
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category with questions
exports.getCategoryWithQuestions = async (req, res) => {
  try {
    const { bankSlug, categorySlug } = req.params;

    // Get the target category with questions
    const category = await questionBankService.getCategoryWithQuestions(
      bankSlug,
      categorySlug
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const otherCategories = await questionBankService.getOtherCategories(
      bankSlug,
      categorySlug
    );

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
      otherCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to your questionBank.controller.js
exports.getQuestionBankBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const questionBank = await questionBankService.getQuestionBankBySlug(slug);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question bank retrieved successfully",
      data: questionBank,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
