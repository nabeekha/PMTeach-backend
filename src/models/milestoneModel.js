const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
