const sectionService = require("../services/sectionService");

const createSection = async (req, res, next) => {
  try {
    const section = await sectionService.createSection(req.body);
    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (err) {
    next(err);
  }
};

const getSections = async (req, res, next) => {
  try {
    const { courseId, page, limit } = req.query;
    const paginationData = { page: page, limit: limit };

    const query = courseId ? { course: courseId } : {};

    const sections = await sectionService.getSections(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    let response = {
      success: true,
      message: "Sections retrieved successfully",
      data: !page && !limit ? sections : sections.data,
    };

    if (sections.total) {
      response.totalItems = sections.total;
      response.pageNumber = Number(sections.page);
      response.totalPages = sections.pages;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const updateSection = async (req, res, next) => {
  try {
    const updatedSection = await sectionService.updateSection(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSection = async (req, res, next) => {
  try {
    await sectionService.deleteSection(req.params.id);
    res.status(204).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
};
