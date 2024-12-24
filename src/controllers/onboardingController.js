const Progress = require("../models/progressModel");
const User = require("../models/userModel");
const onboardingService = require("../services/onboardingService");
// Create or complete onboarding
exports.completeOnboarding = async (req, res) => {
  try {
    const alreadyOnboarded = await User.findById(req.user.id);
    if (alreadyOnboarded.isOnboarded) {
      res.status(200).json({
        success: false,
        message: "You are already onboarded.",
      });
    } else {
      const onboardingData = await onboardingService.createOnboarding(
        req.user.id,
        req.body
      );
      const defaultProgress = new Progress({
        user: req.user.id,
        course: onboardingData.courseId,
        sections: onboardingData.sectionIds.map((section) => ({
          sectionId: section._id,
          completedVideos: [],
        })),
      });
      await defaultProgress.save();
      res.status(201).json({
        success: true,
        message: "Onboarding completed successfully",
        data: onboardingData,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get onboarding data for a specific user
exports.getOnboarding = async (req, res) => {
  const { userId, page, limit } = req.query;
  const paginationData = { page: page, limit: limit };
  const query = userId ? { userId: userId } : {};
  try {
    const onboardingData = await onboardingService.getOnboarding(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );
    let response = {
      success: true,
      message: "Onboarding data retrieved successfully",
      data: !page && !limit ? onboardingData : onboardingData.data,
    };

    if (onboardingData.total) {
      response.totalItems = onboardingData.total;
      response.pageNumber = Number(onboardingData.page);
      response.totalPages = onboardingData.pages;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update onboarding data
// Update onboarding data
exports.updateOnboarding = async (req, res) => {
  try {
    // Update the onboarding data
    const onboardingData = await onboardingService.updateOnboarding(
      req.params.id,
      req.body
    );

    // If onboarding data is not found
    if (!onboardingData) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding data not found" });
    }
    console.log("onboardingData::: ", onboardingData);
    console.log("req.user.id::: ", req.user.id);
    // Fetch the existing progress data for this user and course
    const progressData = await Progress.findOne({
      user: req.user.id,
    });
    console.log("progressData::: ", progressData);
    // If progress data is not found, return a response indicating so
    if (!progressData) {
      return res.status(404).json({
        success: false,
        message: "Progress data not found for this user and course",
      });
    }
    progressData.user = req.user.id;
    progressData.course = onboardingData.courseId;
    // Update progress data by resetting the completed videos for each section
    progressData.sections = onboardingData.sectionIds.map((section) => ({
      sectionId: section._id,
      completedVideos: [], // Reset completed videos to empty
    }));

    // Save the updated progress data
    await progressData.save();

    res.status(200).json({
      success: true,
      message: "Onboarding data and progress updated successfully",
      data: onboardingData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete onboarding data
exports.deleteOnboarding = async (req, res) => {
  const { id } = req.params;
  try {
    const onboardingDeleted = await onboardingService.deleteOnboarding(id);
    if (!onboardingDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding data not found" });
    }
    res.status(200).json({
      success: true,
      message: "Onboarding data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
