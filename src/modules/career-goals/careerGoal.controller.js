const careerGoalService = require("./careerGoal.service");

// Get all career goals
exports.getCareerGoals = async (req, res, next) => {
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };
  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const careerGoals = await careerGoalService.getCareerGoals(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    let response = {
      success: true,
      message: "Career Goals retrieved successfully",
      data: !page && !limit ? careerGoals : careerGoals.data,
    };

    if (careerGoals.total) {
      response.totalItems = careerGoals.total;
      response.pageNumber = Number(careerGoals.page);
      response.totalPages = careerGoals.pages;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// Get a single career goal by ID
exports.getCareerGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const careerGoal = await careerGoalService.getCareerGoalById(id);
    if (!careerGoal) {
      return res
        .status(404)
        .json({ success: false, message: "Career goal not found" });
    }
    res.status(200).json({
      success: true,
      message: "Career goal retrieved successfully",
      data: careerGoal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new career goal
exports.addCareerGoal = async (req, res) => {
  try {
    const careerGoal = await careerGoalService.addCareerGoal(req.body);
    res.status(201).json({
      success: true,
      message: "Career goal added successfully",
      data: careerGoal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a career goal by ID
exports.updateCareerGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCareerGoal = await careerGoalService.updateCareerGoal(
      id,
      req.body
    );
    if (!updatedCareerGoal) {
      return res
        .status(404)
        .json({ success: false, message: "Career goal not found" });
    }
    res.status(200).json({
      success: true,
      message: "Career goal updated successfully",
      data: updatedCareerGoal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a career goal by ID
exports.deleteCareerGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCareerGoal = await careerGoalService.deleteCareerGoal(id);
    if (!deletedCareerGoal) {
      return res
        .status(404)
        .json({ success: false, message: "Career goal not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Career goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
