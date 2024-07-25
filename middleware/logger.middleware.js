const logger = require("../controllers/logger");


const requestLogger = (req, res, next) => {
  try {
    const logMessage = `Username: ${req.session.user ? req.session.user.username : "Unknown"}\n` +
                       `Session ID: ${req.cookies["connect.sid"] || "Unknown"}\n` +
                       `URL: ${req.originalUrl}\n` +
                       `Method: ${req.method}`;

    logger.info(logMessage);
    next();
  } catch (error) {
    console.error("Error in requestLogger middleware:", error);
    next(error); // Pass the error to the next middleware
  }
};

module.exports = requestLogger;
