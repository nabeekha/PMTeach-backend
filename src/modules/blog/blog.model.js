const mongoose = require("mongoose");
const slugify = require("../../utils/slugify");

const blogCategoryModel = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const blogTopicModel = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const blogPostModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    blogImageUrl: String,
    author: {
      name: String,
      avatar: String,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogTopic" }],
    content: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate slug before saving
blogPostModel.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Update updatedAt timestamp before updating
blogPostModel.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const BlogCategory = mongoose.model("BlogCategory", blogCategoryModel);
const BlogTopic = mongoose.model("BlogTopic", blogTopicModel);
const BlogPost = mongoose.model("BlogPost", blogPostModel);

module.exports = { BlogCategory, BlogTopic, BlogPost };
