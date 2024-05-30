const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    image: { type: String },
    previousPasswords: [{ type: String }],
    passwordCreated: { type: Date, default: Date.now }
  },
  { collection: "user-data" }
);

const model = mongoose.model("user-data", User);

module.exports = model;
