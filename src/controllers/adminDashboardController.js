const Course = require("../models/courseModel");
const Section = require("../models/sectionModel");
const Video = require("../models/videoModel");
const Onboarding = require("../models/onboardingModel");
const User = require("../models/userModel");
const CareerGoal = require("../models/careerGoalModel");
const getAdminDashboardData = async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalSections = await Section.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalOnboardings = await Onboarding.countDocuments();
    const totalOnboardedUsers = await User.countDocuments({
      isOnboarded: true,
    });
    const totalNonOnboardedUsers = await User.countDocuments({
      isOnboarded: false,
    });
    const totalCareerGoals = await CareerGoal.countDocuments();
    res.status(200).json({
      success: true,
      message: "Admin data retrieved successfully",
      data: {
        totalCourses,
        totalSections,
        totalVideos,
        totalOnboardings,
        totalOnboardedUsers,
        totalNonOnboardedUsers,
        totalCareerGoals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboardData,
};
