const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
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
    const [startHours, startMinutes] = this.startTime.split(":").map(Number);
    const [endHours, endMinutes] = this.endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    let diff = endTotalMinutes - startTotalMinutes;
    if (diff < 0) diff += 24 * 60;

    this.duration = `${diff} minutes`;
  }
  next();
});

module.exports = mongoose.model("liveSession", liveSessionSchema);
