const mongoose = require("mongoose");

const careerGoalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerGoal", careerGoalSchema);
