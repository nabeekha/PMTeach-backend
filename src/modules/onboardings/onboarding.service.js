const Onboarding = require("./onboarding.model");
const User = require("../users/user.model");
const paginate = require("../../utils/pagination");
// Create or complete onboarding
exports.createOnboarding = async (userId, onboardingData) => {
  const { courseId, sectionIds, careerGoalId } = onboardingData;

  const onboarding = new Onboarding({
    userId,
    courseId,
    sectionIds,
    careerGoalId,
  });

  await User.findByIdAndUpdate(userId, { isOnboarded: true });

  return await onboarding.save();
};

// Get onboarding data for a specific user with pagination
exports.getOnboarding = async (query, page, limit) => {
  const paginationResult = await paginate(Onboarding, query, page, limit);
  const paginationData =
    !page && !limit ? paginationResult : paginationResult.data;
  const onboardingData = await Onboarding.populate(paginationData, [
    {
      path: "sectionIds",
      populate: {
        path: "videos",
      },
    },
    { path: "courseId" },
    { path: "userId" },
    { path: "careerGoalId" },
  ]);
  if (!page && !limit) {
    return onboardingData;
  } else {
    return {
      total: paginationResult.total,
      page: paginationResult.page,
      pages: paginationResult.pages,
      data: onboardingData,
    };
  }
};

// Update onboarding data for a specific user
exports.updateOnboarding = async (id, updatedData) => {
  return await Onboarding.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
};

// Delete onboarding data for a specific user
exports.deleteOnboarding = async (id) => {
  return await Onboarding.findOneAndDelete(id);
};
