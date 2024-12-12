const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    access_level: { type: String, enum: ["basic", "premium", "pro"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
