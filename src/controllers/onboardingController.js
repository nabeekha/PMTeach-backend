const Progress = require("../models/progressModel");
const User = require("../models/userModel");
const onboardingService = require("../services/onboardingService");

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

exports.getOnboarding = async (req, res, next) => {
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };
  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
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
  } catch (err) {
    next(err);
  }
};

exports.updateOnboarding = async (req, res) => {
  try {
    const onboardingData = await onboardingService.updateOnboarding(
      req.params.id,
      req.body
    );

    if (!onboardingData) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding data not found" });
    }
    const progressData = await Progress.findOne({
      user: req.user.id,
    });
    if (!progressData) {
      return res.status(404).json({
        success: false,
        message: "Progress data not found for this user and course",
      });
    }
    progressData.user = req.user.id;
    progressData.course = onboardingData.courseId;
    progressData.sections = onboardingData.sectionIds.map((section) => ({
      sectionId: section._id,
      completedVideos: [],
    }));

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
