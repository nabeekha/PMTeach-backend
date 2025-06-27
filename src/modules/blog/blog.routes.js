const express = require("express");
const router = express.Router();
const {
  getBlogCategories,
  getBlogCategoryById,
  addBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogTopics,
  getBlogTopicById,
  addBlogTopic,
  updateBlogTopic,
  deleteBlogTopic,
  getBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("./blog.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware");

// Blog Category Routes
router.get("/categories", getBlogCategories);
router.get("/categories/:id", getBlogCategoryById);
router.post("/categories", authMiddleware, adminMiddleware, addBlogCategory);
router.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateBlogCategory
);
router.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteBlogCategory
);

// Blog Topic Routes
router.get("/topics", getBlogTopics);
router.get("/topics/:id", getBlogTopicById);
router.post("/topics", authMiddleware, adminMiddleware, addBlogTopic);
router.put("/topics/:id", authMiddleware, adminMiddleware, updateBlogTopic);
router.delete("/topics/:id", authMiddleware, adminMiddleware, deleteBlogTopic);

// Blog Post Routes
router.get("/posts", getBlogPosts);
router.get("/posts/:id", getBlogPostById);
router.get("/posts/slug/:slug", getBlogPostBySlug);
router.post("/posts", authMiddleware, adminMiddleware, addBlogPost);
router.put("/posts/:id", authMiddleware, adminMiddleware, updateBlogPost);
router.delete("/posts/:id", authMiddleware, adminMiddleware, deleteBlogPost);

module.exports = router;
