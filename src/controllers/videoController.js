const videoService = require("../services/videoService");
const { validateVideo } = require("../utils/validation");
const Section = require("../models/sectionModel");

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
  const { page, limit, search, course, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };

  try {
    const query = {};
    if (course) {
      const sections = await Section.find({ course }).select("_id");
      const sectionIds = sections.map((s) => s._id);

      query.section = { $in: sectionIds };
    }
    for (const key in filters) {
      query[key] = filters[key];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
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
    const deleted = await videoService.deleteVideo(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    res.status(200).json({
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
