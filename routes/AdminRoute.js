// // routes/adminRoutes.js
// const express = require("express");
// const router = express.Router();
// const Log = require("../models/LogModel");
// const logger = require("../controllers/logger");

// router.get("/user-activity-logs", async (req, res) => {
//   try {
//     // Log a message using the logger instance
//     logger.info("Fetching user activity logs");

//     // Fetch user activity logs from the database using the Log model
//     const logs = await Log.find({});

//     res.status(200).json({ success: true, logs });
//   } catch (error) {
//     logger.error("Error fetching user activity logs:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Log = require("../models/LogModel");
const logger = require("../controllers/logger");
const { verifyUser, verifyAdmin } = require("../middleware/verify.user");

router.get("/user-activity-logs", verifyUser, verifyAdmin, async (req, res) => {
  try {
    // Log a message using the logger instance
    logger.info("Fetching user activity logs");

    // Fetch user activity logs from the database using the Log model
    const logs = await Log.find({});

    res.status(200).json({ success: true, logs });
  } catch (error) {
    logger.error("Error fetching user activity logs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;


