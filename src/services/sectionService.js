const Section = require("../models/sectionModel");
const paginate = require("../utils/pagination");

const createSection = async (data) => {
  const section = new Section(data);
  return await section.save();
};

const getSections = async (query, page, limit) => {
  return await paginate(Section, query, page, limit);
};

const updateSection = async (id, data) => {
  const section = await Section.findByIdAndUpdate(id, data, { new: true });
  if (!section) throw new Error("Section not found.");
  return section;
};

const deleteSection = async (id) => {
  const section = await Section.findByIdAndDelete(id);
  if (!section) throw new Error("Section not found.");
};

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
};
