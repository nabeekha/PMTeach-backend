const Section = require("../models/sectionModel");
const paginate = require("../utils/pagination");

const createSection = async (data) => {
  const section = new Section(data);
  return await section.save();
};

const getSections = async (query, page, limit) => {
  const paginationResult = await paginate(Section, query, page, limit);
  const paginationData =
    !page && !limit ? paginationResult : paginationResult.data;
  const sectionData = await Section.populate(paginationData, [
    { path: "course" },
  ]);
  if (!page && !limit) {
    return sectionData;
  } else {
    return {
      total: paginationResult.total,
      page: paginationResult.page,
      pages: paginationResult.pages,
      data: sectionData,
    };
  }
};

const updateSection = async (id, data) => {
  const section = await Section.findByIdAndUpdate(id, data, { new: true });
  if (!section) throw new Error("Section not found.");
  return section;
};

const deleteSection = async (id) => {
  return await Section.findByIdAndDelete(id);
};

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
};
