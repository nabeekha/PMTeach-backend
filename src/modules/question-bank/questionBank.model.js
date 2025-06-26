const mongoose = require("mongoose");
const slugify = require("../../utils/slugify");

// Question Schema
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    guide: [String],
    answer: String,
    slug: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    questionBank: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" },
  },
  { timestamps: true }
);

questionSchema.pre("save", function (next) {
  if (this.isModified("question")) {
    this.slug = slugify(this.question);
  }
  next();
});

const Question = mongoose.model("Question", questionSchema);

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    questionBank: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

// Question Bank Schema
const questionBankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    questionTitle: { type: String },
    slug: { type: String, unique: true },
    description: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

questionBankSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);

module.exports = { Question, Category, QuestionBank };
