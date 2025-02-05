const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    courseName: {
      type: String,
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
    },
    paymentId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentHistory", PaymentHistorySchema);
