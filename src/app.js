const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./utils/logger");
const { errorHandler } = require("./middleware/errorHandler");
const database = require("../config/database");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const videoRoutes = require("./routes/videoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentHistoryRoutes = require("./routes/paymentHistoryRoutes");
const stripeWebhookRoutes = require("./routes/stripeWebhookRoutes");
const careerGoalRoutes = require("./routes/careerGoalRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const adminDashboardRoute = require("./routes/adminDashboardRoute");
const { json } = require("express");
const session = require("express-session");
const passport = require("passport");
const progressRoutes = require("./routes/progressRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

const app = express();

// Session configuration
app.use(
  session({
    secret: "your-secret-key",
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
