const Video = require("../models/videoModel");

const createVideo = async (data) => {
  const video = new Video(data);
  return await video.save();
};

const getVideos = async (sectionId) => {
  return await Video.find({ section: sectionId });
};

const getVideoById = async (id) => {
  const video = await Video.findById(id).populate("section").exec();
  if (!video) throw new Error("Video not found.");
  return video;
};

const updateVideo = async (id, data) => {
  const video = await Video.findByIdAndUpdate(id, data, { new: true });
  if (!video) throw new Error("Video not found.");
  return video;
};

const deleteVideo = async (id) => {
  const video = await Video.findByIdAndDelete(id);
  if (!video) throw new Error("Video not found.");
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
