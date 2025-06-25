const express = require("express");
const router = express.Router();
const questionBankController = require("./questionBank.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware");

// Question Bank Routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  questionBankController.createQuestionBank
);
router.get("/", questionBankController.getAllQuestionBanks);
router.get("/:slug", questionBankController.getQuestionBankBySlug);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  questionBankController.updateQuestionBank
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  questionBankController.deleteQuestionBank
);

// Category Routes
router.post(
  "/:bankSlug/categories",
  authMiddleware,
  adminMiddleware,
  questionBankController.createCategory
);
router.get("/:bankSlug/categories", questionBankController.getCategoriesByBank);
router.get(
  "/:bankSlug/categories/:categorySlug",
  questionBankController.getCategoryWithQuestions
);
router.put(
  "/:bankSlug/categories/:categorySlug",
  authMiddleware,
  adminMiddleware,
  questionBankController.updateCategory
);
router.delete(
  "/:bankSlug/categories/:categorySlug",
  authMiddleware,
  adminMiddleware,
  questionBankController.deleteCategory
);

// Question Routes
router.post(
  "/:bankSlug/categories/:categorySlug/questions",
  authMiddleware,
  adminMiddleware,
  questionBankController.createQuestion
);
router.get(
  "/:bankSlug/categories/:categorySlug/questions",
  questionBankController.getQuestionsByCategory
);
router.get(
  "/:bankSlug/categories/:categorySlug/questions/:questionSlug",
  questionBankController.getQuestionBySlug
);
router.put(
  "/:bankSlug/categories/:categorySlug/questions/:questionSlug",
  authMiddleware,
  adminMiddleware,
  questionBankController.updateQuestion
);
router.delete(
  "/:bankSlug/categories/:categorySlug/questions/:questionSlug",
  authMiddleware,
  adminMiddleware,
  questionBankController.deleteQuestion
);

module.exports = router;
