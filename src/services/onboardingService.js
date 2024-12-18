const Onboarding = require("../models/onboardingModel");
const User = require("../models/userModel");
// Create or complete onboarding
exports.createOnboarding = async (userId, onboardingData) => {
  const { courseId, sectionIds, careerGoalId, milestoneIds } = onboardingData;

  const onboarding = new Onboarding({
    userId,
    courseId,
    sectionIds,
    careerGoalId,
    milestoneIds,
  });

  await User.findByIdAndUpdate(userId, { isOnboarded: true });

  return await onboarding.save();
};

// Get onboarding data for a specific user
exports.getOnboarding = async (userId) => {
  let query = userId ? { userId } : {};
  return await Onboarding.find(query)
    .populate({
      path: "sectionIds", // Populate sections
      populate: {
        path: "videos", // Populate videos within each section
      },
    })
    .populate("courseId") // Populate course
    .populate("careerGoalId") // Populate career goal
    .populate("milestoneIds"); // Populate milestones;
};

// Update onboarding data for a specific user
exports.updateOnboarding = async (userId, updatedData) => {
  return await Onboarding.findOneAndUpdate({ userId }, updatedData, {
    new: true,
    runValidators: true,
  });
};

// Delete onboarding data for a specific user
exports.deleteOnboarding = async (id) => {
  return await Onboarding.findOneAndDelete(id);
};
