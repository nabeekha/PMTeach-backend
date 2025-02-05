const express = require("express");
const {
  getPaymentHistory,
} = require("./paymentHistory.controller");

const router = express.Router();

router.get("/", getPaymentHistory);

module.exports = router;
