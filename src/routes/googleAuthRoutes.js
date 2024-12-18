const express = require("express");
const passport = require("passport");
const { OAuth2Strategy } = require("passport-google-oauth");
const Joi = require("joi"); // For validation
const User = require("../models/userModel");

const router = express.Router();

// Validation Schema
const validateUserData = (data) => {
  const schema = Joi.object({
    googleId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string().uri().required(),
  });
  return schema.validate(data);
};

// Passport Config
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };

        // Validate incoming user data
        const { error } = validateUserData(userData);
        if (error) {
          return done(
            new Error(`Validation error: ${error.details[0].message}`),
            null
          );
        }

        // Upsert the user
        const user = await User.findOneAndUpdate(
          { googleId: userData.googleId },
          userData,
          { upsert: true, new: true, runValidators: true }
        );
        return done(null, user);
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const user = req.user;

      // Return user information as JSON or redirect
      res.status(200).json({
        message: "User authenticated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
