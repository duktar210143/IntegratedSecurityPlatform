// logModel.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  message: String,
  level: String,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
