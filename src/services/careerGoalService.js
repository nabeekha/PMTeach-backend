const CareerGoal = require("../models/careerGoalModel");

exports.getCareerGoals = async () => {
  return await CareerGoal.find();
};

exports.getCareerGoalById = async (id) => {
  return await CareerGoal.findById(id);
};

exports.addCareerGoal = async (data) => {
  const careerGoal = new CareerGoal(data);
  return await careerGoal.save();
};

exports.updateCareerGoal = async (id, data) => {
  return await CareerGoal.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteCareerGoal = async (id) => {
  return await CareerGoal.findByIdAndDelete(id);
};
