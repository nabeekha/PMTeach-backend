const mongoose = require("mongoose");
const slugify = require("../../utils/slugify");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    guide: [String],
    answer: String,
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

const questionBankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    categories: [categorySchema],
  },
  { timestamps: true }
);

// Generate slug before saving
questionBankSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// Generate slugs for categories before saving
questionBankSchema.pre("save", function (next) {
  if (this.isModified("categories")) {
    this.categories.forEach((category) => {
      if (!category.slug || category.isModified("title")) {
        category.slug = slugify(category.title);
      }
    });
  }
  next();
});

module.exports = mongoose.model("QuestionBank", questionBankSchema);
