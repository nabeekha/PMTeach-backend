const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    title: String,
    url: String,
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
