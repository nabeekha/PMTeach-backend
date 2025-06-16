const QuestionBank = require("./questionBank.model");
const paginate = require("../../utils/pagination");
const slugify = require("../../utils/slugify");

exports.getAllQuestionBanks = async (query, page, limit) => {
  return await paginate(QuestionBank, query, page, limit);
};

exports.getQuestionBanks = async () => {
  return await QuestionBank.find({}, { "categories.questions": 0 });
};

exports.getQuestionBankById = async (id) => {
  return await QuestionBank.findById(id);
};

exports.addQuestionBank = async (data) => {
  if (!data.slug && data.name) {
    data.slug = slugify(data.name);
  }

  const questionBank = new QuestionBank(data);
  return await questionBank.save();
};

exports.updateQuestionBank = async (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name);
  }

  return await QuestionBank.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteQuestionBank = async (id) => {
  return await QuestionBank.findByIdAndDelete(id);
};

// Get categories for a specific bank
exports.getCategoriesByBankSlug = async (slug) => {
  const bank = await QuestionBank.findOne({ slug })
    .select("name categories.title categories.slug categories.description")
    .lean();

  if (!bank) throw new Error("Question bank not found");

  return {
    questionBank: { name: bank.name },
    data: bank.categories,
  };
};

// Get single category with questions
exports.getCategoryWithQuestions = async (bankSlug, categorySlug) => {
  const bank = await QuestionBank.findOne({ slug: bankSlug });
  if (!bank) throw new Error("Question bank not found");

  const category = bank.categories.find((c) => c.slug === categorySlug);
  if (!category) throw new Error("Category not found");

  return {
    ...category.toObject(),
    questionBank: {
      name: bank.name,
      slug: bank.slug,
    },
  };
};

exports.getOtherCategories = async (bankSlug, excludeCategorySlug) => {
  const bank = await QuestionBank.findOne({ slug: bankSlug })
    .select("categories.title categories.slug categories.description")
    .lean();

  if (!bank) throw new Error("Question bank not found");

  return bank.categories
    .filter((cat) => cat.slug !== excludeCategorySlug)
    .map((cat) => ({
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
    }));
};

exports.getQuestionBankBySlug = async (slug) => {
  return await QuestionBank.findOne({ slug })
    .select("name slug description categories.title categories.slug")
    .lean();
};
