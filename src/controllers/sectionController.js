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
    const deleted = await sectionService.deleteSection(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    res.status(200).json({
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
