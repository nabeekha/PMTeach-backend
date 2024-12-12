const milestoneService = require("../services/milestoneService");

// Get milestones (optionally filtered by careerGoalId)
exports.getMilestones = async (req, res) => {
  try {
    const { careerGoalId } = req.query;
    const milestones = await milestoneService.getMilestones(careerGoalId);
    res.status(200).json({
      success: true,
      message: "Milestones retrieved successfully",
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single milestone by ID
exports.getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await milestoneService.getMilestoneById(id);
    if (!milestone) {
      return res
        .status(404)
        .json({ success: false, message: "Milestone not found" });
    }
    res.status(200).json({
      success: true,
      message: "Milestone retrieved successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new milestone
exports.addMilestone = async (req, res) => {
  try {
    const milestone = await milestoneService.addMilestone(req.body);
    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a milestone by ID
exports.updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMilestone = await milestoneService.updateMilestone(
      id,
      req.body
    );
    if (!updatedMilestone) {
      return res
        .status(404)
        .json({ success: false, message: "Milestone not found" });
    }
    res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      data: updatedMilestone,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a milestone by ID
exports.deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMilestone = await milestoneService.deleteMilestone(id);
    if (!deletedMilestone) {
      return res
        .status(404)
        .json({ success: false, message: "Milestone not found" });
    }
    res.status(200).json({
      success: true,
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
