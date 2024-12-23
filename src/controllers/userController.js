const userService = require("../services/userService");
const { validateUser } = require("../utils/validation");

// Register a new user
const register = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Login a user
const login = async (req, res, next) => {
  try {
    const { email, password, loginType } = req.body;
    const { token, user } = await userService.login({
      email,
      password,
      loginType,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  const { page, limit } = req.query;
  const paginationData = { page: page, limit: limit };

  try {
    const users = await userService.getAllUsers(
      {},
      paginationData.page || null,
      paginationData.limit || null
    );
    let response = {
      success: true,
      message: "Users retrieved successfully",
      data: !page && !limit ? users : users.data,
    };
    if (users.total) {
      response.totalItems = users.total;
      response.pageNumber = Number(users.page);
      response.totalPages = users.pages;
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Create or retrieve user
const createOrRetrieveUser = async (req, res, next) => {
  try {
    const { user, token } = await userService.createOrRetrieveUser(req.body);
    res.status(200).json({
      success: true,
      message: "User created or retrieved successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Update user by ID
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user by ID
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  createOrRetrieveUser,
  updateUser,
  deleteUser,
};
