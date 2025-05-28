const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
const userService = require("./user.service");
const { validateUser } = require("../../utils/validation");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const onboardingService = require("../onboardings/onboarding.service");
const Progress = require("../progress/progress.model");
const {
  getOtpEmailTemplate,
  getPasswordResetTemplate,
} = require("../../common/templates/emailTemplates");
// Register a new user
const register = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email } = req.body;
    const { user, token } = await userService.register(req.body);
    await sendOtp(email);
    res.status(201).json({
      success: true,
      message: "OTP sent to email",
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      // Resend OTP
      const { otp } = await userService.sendOtp(email);
      const mailData = {
        from: `Pm Teach <no-reply@${DOMAIN}>`,
        to: email,
        subject: "Email Verification OTP",
        html: getOtpEmailTemplate(otp),
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      };
      mg.messages().send(mailData);

      return res.status(401).json({
        success: false,
        message: "userNotVerified",
      });
    }

    const { token, user: validUser } = await userService.login({
      email,
      password,
      loginType,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: validUser,
    });
  } catch (err) {
    next(err);
  }
};

// Gel All User
const getAllUsers = async (req, res, next) => {
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
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await userService.getAllUsers(
      query,
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

// Send OTP
const sendOtp = async (email) => {
  try {
    const { otp } = await userService.sendOtp(email);

    const mailData = {
      from: `Pm Teach <no-reply@${DOMAIN}>`,
      to: email,
      subject: "Your OTP Code",
      html: getOtpEmailTemplate(otp),
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    mg.messages().send(mailData);
  } catch (err) {
    // console.log("err::: ", err);
  }
};

// Verify OTP
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, onboardedId } = req.body;

    const isValid = await userService.verifyOtp(email, otp);
    if (!isValid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    let updatedUser = user;

    if (onboardedId) {
      const onboardingData = await onboardingService.updateOnboarding(
        onboardedId,
        {
          userId: user._id,
        }
      );

      // Create default progress
      const defaultProgress = new Progress({
        user: user._id,
        course: onboardingData.courseId,
        sections: onboardingData.sectionIds.map((section) => ({
          sectionId: section._id,
          completedVideos: [],
        })),
      });
      await defaultProgress.save();

      // Update isOnboarded and get the updated user
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        { isOnboarded: true },
        { new: true }
      );
    }

    const token = jwt.sign(
      {
        id: updatedUser._id,
        role: updatedUser.role,
        loginType: updatedUser.loginType,
        isOnboarded: updatedUser.isOnboarded,
        isVerified: updatedUser.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { user, otp } = await userService.forgotPassword(email);

    const mailData = {
      from: `Pm Teach <no-reply@${DOMAIN}>`,
      to: email,
      subject: "Reset Password OTP",
      html: getPasswordResetTemplate(otp),
      text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    };

    mg.messages().send(mailData, (error, body) => {
      if (error) return next(error);
      res
        .status(200)
        .json({ success: true, message: "Password reset OTP sent" });
    });
  } catch (err) {
    next(err);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const reset = await userService.resetPassword(email, otp, newPassword);
    if (!reset)
      return res.status(400).json({ message: "OTP invalid or expired" });

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

// RE Send OTP
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { otp } = await userService.sendOtp(email);

    const mailData = {
      from: `Pm Teach <no-reply@${DOMAIN}>`,
      to: email,
      subject: "Your OTP Code",
      html: getOtpEmailTemplate(otp),
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    mg.messages().send(mailData, (error, body) => {
      if (error) return next(error);
      res.status(200).json({ success: true, message: "OTP sent to email" });
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
  verifyOtp,
  forgotPassword,
  resetPassword,
  resendOtp,
};
