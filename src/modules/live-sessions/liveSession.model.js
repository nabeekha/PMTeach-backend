const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: String },
    speaker: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    meetLink: { type: String, required: true },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

liveSessionSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const diff = (new Date(this.endTime) - new Date(this.startTime)) / 60000; // Convert ms to minutes
    this.duration = `${diff} minutes`;
  }
  next();
});

module.exports = mongoose.model("liveSession", liveSessionSchema);
