const express = require("express");
const {
  createCheckoutSession,
} = require("../../common/controllers/payment.controller");

const router = express.Router();

router.post("/stripe/create-checkout-session", createCheckoutSession);

module.exports = router;
