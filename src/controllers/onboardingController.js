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
  const { userId } = req.query;
  try {
    const onboardingData = await onboardingService.getOnboarding(userId);
    if (!onboardingData) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding data not found" });
    }
    res.status(200).json({
      success: true,
      message: "Onboarding data retrieved successfully",
      data: onboardingData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update onboarding data
exports.updateOnboarding = async (req, res) => {
  try {
    const onboardingData = await onboardingService.updateOnboarding(
      req.user.id,
      req.body
    );
    if (!onboardingData) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding data not found" });
    }
    res.status(200).json({
      success: true,
      message: "Onboarding data updated successfully",
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
