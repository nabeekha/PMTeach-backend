const liveSessionService = require("./liveSession.service");
const User = require("../users/user.model");
const createLiveSession = async (req, res, next) => {
  try {
    const liveSession = await liveSessionService.createLiveSession(req.body);
    res.status(201).json({
      success: true,
      message: "liveSession created successfully",
      data: liveSession,
    });
  } catch (err) {
    next(err);
  }
};

const getAllLiveSessions = async (req, res, next) => {
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
    const liveSessions = await liveSessionService.getAllLiveSessions(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    const newData = !page && !limit ? liveSessions : liveSessions.data;

    const finalData = newData.map((session) => {
      return {
        ...session.toObject(),
        totalStudents: session?.registeredUsers?.length,
      };
    });

    let response = {
      success: true,
      message: "LiveSessions retrieved successfully",
      data: finalData,
    };
    if (liveSessions.total) {
      response.totalItems = liveSessions.total;
      response.pageNumber = Number(liveSessions.page);
      response.totalPages = liveSessions.pages;
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const getLiveSessionById = async (req, res, next) => {
  try {
    const liveSession = await liveSessionService.getLiveSessionById(
      req.params.id
    );
    if (!liveSession) {
      return res
        .status(404)
        .json({ success: false, message: "liveSession not found" });
    }
    const suggestedSessions = await liveSessionService.getSuggestedSessions(
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "liveSession retrieved successfully",
      data: {
        session: liveSession,
        suggestions: suggestedSessions,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateLiveSession = async (req, res, next) => {
  try {
    const updatedLiveSession = await liveSessionService.updateLiveSession(
      req.params.id,
      req.body
    );
    if (!updatedLiveSession) {
      return res
        .status(404)
        .json({ success: false, message: "liveSession not found" });
    }
    res.status(200).json({
      success: true,
      message: "liveSession updated successfully",
      data: updatedLiveSession,
    });
  } catch (err) {
    next(err);
  }
};

const deleteLiveSession = async (req, res, next) => {
  try {
    const deleted = await liveSessionService.deleteLiveSession(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "liveSession not found" });
    }
    res.status(200).json({
      success: true,
      message: "liveSession deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const registerUserForSession = async (req, res, next) => {
  try {
    const { sessionIds, email, suggestedSessionIds } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: true,
        message: "Sign Up before the register the event.",
      });
    }
    await liveSessionService.registerUserForSessions(
      sessionIds,
      suggestedSessionIds,
      email,
      user._id
    );

    res.status(200).json({
      success: true,
      message: "Registered successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const sendUserNotifications = async (req, res, next) => {
  const { sessionIds } = req.body;
  try {
    await liveSessionService.sendSessionNotification(sessionIds);
    res.status(201).json({
      success: true,
      message: "Notification send successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  updateLiveSession,
  deleteLiveSession,
  registerUserForSession,
  sendUserNotifications,
};
