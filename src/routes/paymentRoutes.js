const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentController");

const router = express.Router();

router.post("/stripe/create-checkout-session", createCheckoutSession);

module.exports = router;
