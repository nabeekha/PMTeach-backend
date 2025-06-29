const mongoose = require("mongoose");
const slugify = require("../../utils/slugify");
const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    date: {
      type: Date,
      required: function () {
        return this.sessionType === "live";
      },
    },
    startTime: {
      type: String,
      required: function () {
        return this.sessionType === "live";
      },
    },
    endTime: {
      type: String,
      required: function () {
        return this.sessionType === "live";
      },
    },
    duration: { type: String },
    speaker: { type: String, required: true },
    speakerDescription: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    sessionType: {
      type: String,
      required: true,
      enum: ["live", "onDemand"],
      default: "live",
    },
    meetLink: {
      type: String,
      required: function () {
        return this.sessionType === "live";
      },
    },
    videoUrl: {
      type: String,
      required: function () {
        return this.sessionType === "onDemand";
      },
    },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

liveSessionSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  if (this.startTime && this.endTime && this.sessionType === "live") {
    const [startHours, startMinutes] = this.startTime.split(":").map(Number);
    const [endHours, endMinutes] = this.endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    let diff = endTotalMinutes - startTotalMinutes;
    if (diff < 0) diff += 24 * 60;

    this.duration = `${diff}`;
  }
  next();
});

liveSessionSchema.statics.findBySlug = async function (slug) {
  return this.findOne({ slug });
};

module.exports = mongoose.model("liveSession", liveSessionSchema);
