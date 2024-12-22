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

const getVideos = async (req, res, next) => {
  const { page, limit, sectionId } = req.query;
  const paginationData = { page: page, limit: limit };

  try {
    const query = sectionId ? { section: sectionId } : {};

    const videos = await videoService.getVideos(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    let response = {
      success: true,
      message: "Videos retrieved successfully",
      data: !page && !limit ? videos : videos.data,
    };

    if (videos.total) {
      response.totalItems = videos.total;
      response.pageNumber = Number(videos.page);
      response.totalPages = videos.pages;
    }

    res.status(200).json(response);
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
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
