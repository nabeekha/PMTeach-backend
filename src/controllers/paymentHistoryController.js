const PaymentHistory = require("../models/PaymentHistory");

// Save payment to history
exports.addPaymentHistory = async (paymentData) => {
  try {
    const payment = new PaymentHistory(paymentData);
    await payment.save();
  } catch (error) {
    console.error("Error saving payment history:", error.message);
  }
};

// Get payment history for a user
exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch payment history for the user
    const history = await PaymentHistory.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
    });
  }
};
