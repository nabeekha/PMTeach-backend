const express = require("express");
const {
  stripeWebhookHandler,
} = require("../../common/controllers/stripeWebhook.controller");
const router = express.Router();

router.post("/webhook", stripeWebhookHandler);

module.exports = router;
