const CareerGoal = require("../models/careerGoalModel");
const paginate = require("../utils/pagination");

exports.getCareerGoals = async (query, page, limit) => {
  return await paginate(CareerGoal, query, page, limit);
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
