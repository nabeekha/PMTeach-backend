const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    sections: [
      {
        sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
        completedVideos: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
