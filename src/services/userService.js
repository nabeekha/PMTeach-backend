const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const paginate = require("../utils/pagination");

// Register a new user
const register = async ({ name, email, password, loginType }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    loginType: loginType,
  });
  const user = await newUser.save();

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        loginType,
        isOnboarded: user.isOnboarded,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { token, user };
  }
};

// Login a user
const login = async ({ email, password, loginType }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials.");
  if (user.loginType !== loginType)
    throw new Error("You are already registered with google.");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const token = jwt.sign(
    { id: user._id, role: user.role, loginType, isOnboarded: user.isOnboarded },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};

// Get all users
const getAllUsers = async (query, page, limit) => {
  return await paginate(User, query, page, limit);
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Create or retrieve user
const createOrRetrieveUser = async ({ email, name, loginType }) => {
  let user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        loginType,
        isOnboarded: user.isOnboarded,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { token, user };
  }
  user = new User({
    email,
    name,
    loginType: loginType || "manual",
  });

  const newUser = await user.save();
  if (newUser) {
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        loginType,
        isOnboarded: user.isOnboarded,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { token, user: newUser };
  }
};

// Update user by ID
const updateUser = async (id, updatedData) => {
  return await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
};

// Delete user by ID
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
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
