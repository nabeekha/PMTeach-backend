const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    videos_watched: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
