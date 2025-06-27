const { BlogCategory, BlogTopic, BlogPost } = require("./blog.model");
const paginate = require("../../utils/pagination");

// Blog Category Services
exports.getBlogCategories = async () => {
  return await BlogCategory.find().sort({ createdAt: -1 });
};

exports.getBlogCategoryById = async (id) => {
  return await BlogCategory.findById(id);
};

exports.addBlogCategory = async (data) => {
  const category = new BlogCategory(data);
  return await category.save();
};

exports.updateBlogCategory = async (id, data) => {
  return await BlogCategory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteBlogCategory = async (id) => {
  return await BlogCategory.findByIdAndDelete(id);
};

// Blog Topic Services
exports.getBlogTopics = async () => {
  return await BlogTopic.find().sort({ createdAt: -1 });
};

exports.getBlogTopicById = async (id) => {
  return await BlogTopic.findById(id);
};

exports.addBlogTopic = async (data) => {
  const topic = new BlogTopic(data);
  return await topic.save();
};

exports.updateBlogTopic = async (id, data) => {
  return await BlogTopic.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteBlogTopic = async (id) => {
  return await BlogTopic.findByIdAndDelete(id);
};

// Blog Post Services
exports.getBlogPosts = async (query, page, limit) => {
  return await paginate(BlogPost, query, page, limit, {
    path: "categories topics",
    select: "name",
  });
};

exports.getBlogPostById = async (id) => {
  return await BlogPost.findById(id).populate("categories topics", "name");
};

exports.getBlogPostBySlug = async (slug) => {
  return await BlogPost.findOne({ slug }).populate("categories topics", "name");
};

exports.addBlogPost = async (data) => {
  const post = new BlogPost(data);
  return await post.save();
};

exports.updateBlogPost = async (id, data) => {
  return await BlogPost.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("categories topics", "name");
};

exports.deleteBlogPost = async (id) => {
  return await BlogPost.findByIdAndDelete(id);
};
