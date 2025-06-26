const questionBankService = require("./questionBank.service");

// Question Bank Controllers
exports.createQuestionBank = async (req, res) => {
  try {
    const questionBank = await questionBankService.createQuestionBank(req.body);
    res.status(201).json({
      success: true,
      message: "Question bank created successfully",
      data: questionBank,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllQuestionBanks = async (req, res) => {
  try {
    const questionBanks = await questionBankService.getAllQuestionBanks();
    res.status(200).json({
      success: true,
      message: "Question banks retrieved successfully",
      data: questionBanks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuestionBankBySlug = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.slug
    );
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

exports.updateQuestionBank = async (req, res) => {
  try {
    const questionBank = await questionBankService.updateQuestionBank(
      req.params.id,
      req.body
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Question bank updated successfully",
      data: questionBank,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestionBank = async (req, res) => {
  try {
    const questionBank = await questionBankService.deleteQuestionBank(
      req.params.id
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Question bank deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Category Controllers
exports.createCategory = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.createCategory({
      ...req.body,
      questionBank: questionBank._id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCategoriesByBank = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const categories = await questionBankService.getCategoriesByBank(
      questionBank._id
    );

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      questionBank: {
        name: questionBank.name,
        slug: questionBank.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryWithQuestions = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const questions = await questionBankService.getQuestionsByCategory(
      category._id
    );

    const otherCategories = await questionBankService.getCategoriesByBank(
      questionBank._id
    );

    res.status(200).json({
      success: true,
      message: "Category with questions retrieved successfully",
      data: {
        ...category.toObject(),
        questions,
      },
      otherCategories: otherCategories.filter(
        (c) => c._id.toString() !== category._id.toString()
      ),
      questionBank: {
        name: questionBank.name,
        slug: questionBank.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory = await questionBankService.updateCategory(
      category._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await questionBankService.deleteCategory(category._id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Question Controllers
exports.createQuestion = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const question = await questionBankService.createQuestion({
      ...req.body,
      category: category._id,
      questionBank: questionBank._id,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuestionsByCategory = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const questions = await questionBankService.getQuestionsByCategory(
      category._id
    );

    // Get all other categories in the same question bank
    const otherCategories = await questionBankService
      .getCategoriesByBank(questionBank._id)
      .then((categories) =>
        categories
          .filter((c) => c._id.toString() !== category._id.toString())
          .map(({ _id, title, slug, description }) => ({
            _id,
            title,
            slug,
            description,
          }))
      );

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      data: questions,
      currentCategory: category,
      otherCategories,
      questionBank: {
        name: questionBank.name,
        slug: questionBank.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuestionBySlug = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const question = await questionBankService.getQuestionBySlug(
      category._id,
      req.params.questionSlug
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question retrieved successfully",
      data: question,
      category: {
        title: category.title,
        slug: category.slug,
      },
      questionBank: {
        name: questionBank.name,
        slug: questionBank.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const question = await questionBankService.getQuestionBySlug(
      category._id,
      req.params.questionSlug
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const updatedQuestion = await questionBankService.updateQuestion(
      question._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  console.log("req.params.bankSlug::: ", req.params.bankSlug);
  try {
    const questionBank = await questionBankService.getQuestionBankBySlug(
      req.params.bankSlug
    );
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: "Question bank not found",
      });
    }

    const category = await questionBankService.getCategoryBySlug(
      questionBank._id,
      req.params.categorySlug
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    console.log("req.params.questionSlug::: ", req.params.questionSlug);
    const question = await questionBankService.getQuestionBySlug(
      category._id,
      req.params.questionSlug
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await questionBankService.deleteQuestion(question._id);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
