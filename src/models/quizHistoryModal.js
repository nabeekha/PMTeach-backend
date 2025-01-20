const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    selectedAnswers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        selectedAnswer: { type: String, required: true },
      },
    ],
    correctAnswers: { type: Number, required: true },
    incorrectAnswers: { type: Number, required: true },
    totalScore: { type: Number, required: true },
  },
  { timestamps: true }
);

quizHistorySchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
