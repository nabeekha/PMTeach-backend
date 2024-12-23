const PaymentHistory = require("../models/PaymentHistory");
const paginate = require("../utils/pagination");

const getPaymentHistory = async (query, page, limit) => {
  return await paginate(PaymentHistory, query, page, limit);
};

module.exports = { getPaymentHistory };
