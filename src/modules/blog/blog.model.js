const mongoose = require("mongoose");
const slugify = require("../../utils/slugify");

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const blogTopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    featuredImage: String,
    author: {
      name: String,
      avatar: String,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogTopic" }],
    content: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate slug before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Update updatedAt timestamp before updating
blogPostSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
const BlogTopic = mongoose.model("BlogTopic", blogTopicSchema);
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { BlogCategory, BlogTopic, BlogPost };
