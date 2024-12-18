const express = require("express");
const {
  stripeWebhookHandler,
} = require("../controllers/stripeWebhookController");
const router = express.Router();

router.post("/webhook", stripeWebhookHandler);

module.exports = router;
