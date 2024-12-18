const Progress = require("../models/progressModel");
const Video = require("../models/videoModel");

const markVideoAsCompleted = async (userId, videoId) => {
  const progress = await Progress.findOneAndUpdate(
    { user: userId, video: videoId },
    { completed: true },
    { upsert: true, new: true }
  );
  return progress;
};

const getProgressByUser = async (userId) => {
  return await Progress.find({ user: userId }).populate("video");
};

const getProgressByCourse = async (userId, courseId) => {
  const progress = await Progress.find({ user: userId })
    .populate({
      path: "video",
      populate: {
        path: "section",
        match: { course: courseId },
      },
    })
    .exec();

  return progress.filter((p) => p.video.section); // Remove unmatched sections
};

module.exports = {
  markVideoAsCompleted,
  getProgressByUser,
  getProgressByCourse,
};
