const express = require("express");
const router = express.Router();
const {
  getQuestionBanks, // For tabs
  getQuestionBankBySlug, // For specific bank
  getBankCategories, // Categories for a bank
  getCategoryWithQuestions, // Single category with questions
  addQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  getAllQuestionBanks,
} = require("./questionBank.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware");

// Tabs data
router.get("/question-tabs", getQuestionBanks);

// All banks data
router.get("/", getAllQuestionBanks);

// Get specific question bank
router.get("/:slug", getQuestionBankBySlug);

// Get categories for a question bank
router.get("/:slug/categories", getBankCategories);

// Get single category with questions
router.get("/:bankSlug/categories/:categorySlug", getCategoryWithQuestions);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, addQuestionBank);
router.put("/:id", authMiddleware, adminMiddleware, updateQuestionBank);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuestionBank);

module.exports = router;
