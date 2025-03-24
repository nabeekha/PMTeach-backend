const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./utils/logger");
const { errorHandler } = require("./middleware/errorHandler");
const database = require("../config/database");
const userRoutes = require("./modules/users/user.routes");
const courseRoutes = require("./modules/courses/course.routes");
const sectionRoutes = require("./modules/sections/section.routes");
const videoRoutes = require("./modules/videos/video.routes");
const paymentRoutes = require("./common/routes/payment.routes");
const paymentHistoryRoutes = require("./modules/payment-histories/paymentHistory.routes");
const stripeWebhookRoutes = require("./common/routes/stripeWebhook.routes");
const careerGoalRoutes = require("./modules/career-goals/careerGoal.routes");
const onboardingRoutes = require("./modules/onboardings/onboarding.routes");
const adminDashboardRoute = require("./common/routes/adminDashboard.routes");
const quizRoute = require("./modules/quizzes/quiz.routes");
const quizHistoryRoute = require("./modules/quiz-histories/quizHistory.routes");
const { json } = require("express");
const session = require("express-session");
const passport = require("passport");
const progressRoutes = require("./modules/progress/progress.routes");
const googleAuthRoutes = require("./common/routes/googleAuth.routes");
const uploadResumeRoutes = require("./common/routes/uploadResume.routes");
const liveSessionRoutes = require("./modules/live-sessions/liveSession.routes");

const app = express();

// Session configuration
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(morgan("dev"));
app.use(cors());

app.use(json());
app.use(passport.initialize());
app.use(passport.session());

// Google authentication routes
app.use("/auth", googleAuthRoutes);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-history", paymentHistoryRoutes);
app.use("/api/stripe", stripeWebhookRoutes);
app.use("/api/career-goals", careerGoalRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/admin-dashboard", adminDashboardRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/quiz-history", quizHistoryRoute);
app.use("/api/upload-resume", uploadResumeRoutes);
app.use("/api/live-sessions", liveSessionRoutes);
// Redirect route after login success
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`Welcome ${req.user.name}, you are logged in!`);
  }
  res.redirect("/");
});

// Error Handling Middleware
app.use(errorHandler);

// Connect to Database
database.connect();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
