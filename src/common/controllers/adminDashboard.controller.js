const Course = require("../../modules/courses/course.model");
const Section = require("../../modules/sections/section.model");
const Video = require("../../modules/videos/video.model");
const Onboarding = require("../../modules/onboardings/onboarding.model");
const User = require("../../modules/users/user.model");
const CareerGoal = require("../../modules/career-goals/careerGoal.model");

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
