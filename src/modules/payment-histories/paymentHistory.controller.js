const PaymentHistory = require("./paymentHistory.model");
const paymentHistoryService = require("./paymentHistory.service");
// Save payment to history
exports.addPaymentHistory = async (paymentData) => {
  try {
    const payment = new PaymentHistory(paymentData);
    await payment.save();
  } catch (error) {
    console.error("Error saving payment history:", error.message);
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const paginationData = { page: page, limit: limit };

    const query = userId ? { userId } : {};

    const history = await paymentHistoryService.getPaymentHistory(
      query,
      paginationData.page,
      paginationData.limit
    );

    let response = {
      success: true,
      message: "Payment history retrieved successfully",
      data: !page && !limit ? history : history.data,
    };

    if (history.total) {
      response.totalItems = history.total;
      response.pageNumber = history.page;
      response.totalPages = history.pages;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching payment history:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
    });
  }
};
