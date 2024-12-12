const videoService = require("../services/videoService");
const { validateVideo } = require("../utils/validation");

const createVideo = async (req, res, next) => {
  const { error } = validateVideo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const video = await videoService.createVideo(req.body);
    res.status(201).json({
      success: true,
      message: "Video created successfully",
      data: video,
    });
  } catch (err) {
    next(err);
  }
};

const getVideosBySection = async (req, res, next) => {
  try {
    const videos = await videoService.getVideosBySection(req.params.sectionId);
    res.status(200).json({
      success: true,
      message: "Videos retrieved successfully",
      data: videos,
    });
  } catch (err) {
    next(err);
  }
};

const getVideoById = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Video retrieved successfully",
      data: video,
    });
  } catch (err) {
    next(err);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const updatedVideo = await videoService.updateVideo(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: updatedVideo,
    });
  } catch (err) {
    next(err);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    await videoService.deleteVideo(req.params.id);
    res.status(204).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createVideo,
  getVideosBySection,
  getVideoById,
  updateVideo,
  deleteVideo,
};
