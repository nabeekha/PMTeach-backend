const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: String,
    url: String,
  },
  { timestamps: true }
);

sectionSchema.virtual("videos", {
  ref: "Video",
  localField: "_id",
  foreignField: "section",
});

sectionSchema.set("toJSON", { virtuals: true });
sectionSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Section", sectionSchema);
