const Video = require("../models/videoModel");
const paginate = require("../utils/pagination");

const createVideo = async (data) => {
  const video = new Video(data);
  return await video.save();
};

const getVideos = async (query, page, limit) => {
  const paginationResult = await paginate(Video, query, page, limit);
  const paginationData =
    !page && !limit ? paginationResult : paginationResult.data;
  const videoData = await Video.populate(paginationData, [
    {
      path: "section",
      populate: {
        path: "course",
      },
    },
  ]);
  if (!page && !limit) {
    return videoData;
  } else {
    return {
      total: paginationResult.total,
      page: paginationResult.page,
      pages: paginationResult.pages,
      data: videoData,
    };
  }
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
  return await Video.findByIdAndDelete(id);
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
