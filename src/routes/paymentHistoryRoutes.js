const express = require("express");
const {
  getPaymentHistory,
} = require("../controllers/paymentHistoryController");

const router = express.Router();

router.get("/", getPaymentHistory);

module.exports = router;
