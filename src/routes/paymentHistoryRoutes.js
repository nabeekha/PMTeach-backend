const express = require("express");
const {
  getPaymentHistory,
} = require("../controllers/paymentHistoryController");

const router = express.Router();

// Route to get payment history for a specific user
router.get("/:userId", getPaymentHistory);

module.exports = router;
