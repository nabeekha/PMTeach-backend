const progressService = require("../services/progressService");

const markVideoAsCompleted = async (req, res, next) => {
  try {
    const progress = await progressService.markVideoAsCompleted(
      req.user._id,
      req.body.videoId
    );
    res.status(201).json(progress);
  } catch (err) {
    next(err);
  }
};

const getProgressByUser = async (req, res, next) => {
  try {
    const progress = await progressService.getProgressByUser(req.user._id);
    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
};

const getProgressByCourse = async (req, res, next) => {
  try {
    const progress = await progressService.getProgressByCourse(
      req.user._id,
      req.params.courseId
    );
    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  markVideoAsCompleted,
  getProgressByUser,
  getProgressByCourse,
};
