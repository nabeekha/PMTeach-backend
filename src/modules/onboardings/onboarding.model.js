const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sectionIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  ],
  careerGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareerGoal",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Onboarding", onboardingSchema);
