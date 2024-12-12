const Milestone = require("../models/milestoneModel");

exports.getMilestones = async (careerGoalId) => {
  const query = careerGoalId ? { careerGoalId } : {};
  return await Milestone.find(query);
};

exports.getMilestoneById = async (id) => {
  return await Milestone.findById(id);
};

exports.addMilestone = async (data) => {
  const milestone = new Milestone(data);
  return await milestone.save();
};

exports.updateMilestone = async (id, data) => {
  return await Milestone.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMilestone = async (id) => {
  return await Milestone.findByIdAndDelete(id);
};
