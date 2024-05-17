const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // confirmPassword:{type:String,},
    email: { type: String },
    image: { type: String },
  },
  { collection: "user-data" }
);

const model = mongoose.model("user-data", User);

module.exports = model;
