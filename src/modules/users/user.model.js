const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["super-admin", "user"], default: "user" },
    membership: {
      type: String,
      enum: ["free", "base", "premium"],
      default: "free",
    },
    loginType: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    membership_interval: {
      type: String,
      enum: ["monthly", "yearly"],
      default: null,
    },
    membership_start_date: Date,
    membership_end_date: Date,
    stripeCustomerId: String,
    subscriptionId: String,
    isOnboarded: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
