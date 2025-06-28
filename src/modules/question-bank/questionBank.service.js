const { Question, Category, QuestionBank } = require("./questionBank.model");

// Question Bank Services
exports.createQuestionBank = async (data) => {
  return await QuestionBank.create(data);
};

exports.getAllQuestionBanks = async (search = "") => {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  return await QuestionBank.find(query).sort({ createdAt: -1 });
};

exports.getQuestionBankBySlug = async (slug) => {
  return await QuestionBank.findOne({ slug });
};

exports.updateQuestionBank = async (id, data) => {
  return await QuestionBank.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteQuestionBank = async (id) => {
  const bank = await QuestionBank.findByIdAndDelete(id);
  if (bank) {
    await Category.deleteMany({ questionBank: id });
    await Question.deleteMany({ questionBank: id });
  }
  return bank;
};

// Category Services
exports.createCategory = async (data) => {
  const category = await Category.create(data);
  if (category && data.questionBank) {
    await QuestionBank.findByIdAndUpdate(data.questionBank, {
      $push: { categories: category._id },
    });
  }
  return category;
};

exports.getCategoriesByBank = async (bankId, search = "") => {
  const query = { questionBank: bankId };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  return await Category.find(query).sort({ title: 1 });
};

exports.getCategoryBySlug = async (questionBankId, slug) => {
  return await Category.findOne({ questionBank: questionBankId, slug });
};

exports.updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (category) {
    await QuestionBank.findByIdAndUpdate(category.questionBank, {
      $pull: { categories: category._id },
    });
    await Question.deleteMany({ category: id });
  }
  return category;
};

// Question Services
exports.createQuestion = async (data) => {
  const question = await Question.create(data);
  if (question && data.category) {
    await Category.findByIdAndUpdate(data.category, {
      $push: { questions: question._id },
    });
  }
  return question;
};

exports.getQuestionsByCategory = async (categoryId, search = "") => {
  const query = { category: categoryId };
  if (search) {
    query.$or = [
      { question: { $regex: search, $options: "i" } },
      { answer: { $regex: search, $options: "i" } },
      { guide: { $regex: search, $options: "i" } },
    ];
  }
  return await Question.find(query).sort({ createdAt: -1 });
};

exports.getQuestionBySlug = async (categoryId, slug) => {
  return await Question.findOne({ category: categoryId, slug });
};

exports.updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteQuestion = async (id) => {
  const question = await Question.findByIdAndDelete(id);
  if (question && question.category) {
    await Category.findByIdAndUpdate(question.category, {
      $pull: { questions: question._id },
    });
  }
  return question;
};
