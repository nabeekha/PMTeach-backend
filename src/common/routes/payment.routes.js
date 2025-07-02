const express = require("express");
const {
  createCheckoutSession,
  cancelSubscription,
  getSubscriptionStatus,
  getPlanOptions,
} = require("../../common/controllers/payment.controller");
const { authMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/cancel-subscription", authMiddleware, cancelSubscription);
router.get("/status", authMiddleware, getSubscriptionStatus);
router.get("/plan-options", authMiddleware, getPlanOptions);

module.exports = router;
