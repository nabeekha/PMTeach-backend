const mongoose = require("mongoose");
const logger = require("../src/utils/logger");
require("dotenv").config();

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB:", connection.connection.host);
  } catch (error) {
    logger.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connect };
