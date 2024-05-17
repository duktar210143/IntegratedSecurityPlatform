const mongoose = require("mongoose");

const databaseConnection = () => {
  mongoose.connect("mongodb://localhost:27017/discussionForum");
};

module.exports = databaseConnection;