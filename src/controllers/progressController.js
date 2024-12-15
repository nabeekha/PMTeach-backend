const Progress = require("../models/progressModel");
const onboardingService = require("../services/onboardingService");
exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    let onboardingData = await onboardingService.getOnboarding(userId);

    if (!onboardingData) {
      return res.status(404).json({
        success: false,
        message: "Onboarding data not found",
      });
    }

    const courseId = onboardingData[0].courseId._id;
    const progress = await Progress.findOne({
      user: userId,
      course: courseId,
    })
      .populate({
        path: "sections.sectionId",
        populate: {
          path: "videos",
        },
      })
      .exec();

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found for this course.",
      });
    }

    // Calculate the total number of completed videos
    const totalCompletedVideo = progress.sections.reduce(
      (total, section) => total + section.completedVideos.length,
      0
    );

    let totalVideos = 0;
    let sectionProgress = [];

    // Loop through onboardingData to calculate the total videos and individual section progress
    onboardingData.forEach((onboarding) => {
      onboarding.sectionIds.forEach((section) => {
        totalVideos += section?.videos?.length;

        // Calculate the completed videos in the section
        const sectionProgressData = progress.sections.find(
          (s) => s.sectionId.id === section.id
        );
        const completedVideosInSection = sectionProgressData
          ? sectionProgressData.completedVideos.length
          : 0;

        const sectionProgressPercentage = section.videos?.length
          ? (completedVideosInSection / section.videos.length) * 100
          : 0;
        sectionProgress.push({
          sectionId: section.sectionId,
          sectionTitle: section.title, // Assuming `title` exists in the section object
          completedVideos: completedVideosInSection,
          totalVideos: section.videos?.length,
          progressPercentage: sectionProgressPercentage,
        });
      });
    });

    let progressPercentage = 0;
    if (totalVideos > 0) {
      progressPercentage = (totalCompletedVideo / totalVideos) * 100;
    }

    return res.json({
      success: true,
      message: "Progress fetched successfully",
      data: {
        onboardingData,
        progressPercentage,
        sectionProgress,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { userId, courseId, sectionId, videoId } = req.body;

    // Find or create the progress document
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        sections: [{ sectionId, completedVideos: [videoId] }],
      });
    } else {
      // Find if the section exists in the progress
      const sectionIndex = progress.sections.findIndex(
        (section) => section.sectionId.toString() === sectionId
      );

      if (sectionIndex !== -1) {
        // Check if the video has already been marked as completed
        if (
          !progress.sections[sectionIndex].completedVideos.includes(videoId)
        ) {
          progress.sections[sectionIndex].completedVideos.push(videoId);
        }
      } else {
        // If section doesn't exist, add a new one
        progress.sections.push({
          sectionId,
          completedVideos: [videoId],
        });
      }
    }

    await progress.save();
    return res.json({ message: "Progress updated successfully." });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
