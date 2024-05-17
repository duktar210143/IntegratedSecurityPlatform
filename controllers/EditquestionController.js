const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Question = require("../models/Question.model");
const cloudinary = require("cloudinary");

const getUserQuestion = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers["x-access-token"];

    // Check if the token is provided
    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    // Decode the token to retrieve the user's email
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Get the email from the decoded token
    const userId = decoded.userId;
    console.log(userId);
    // Find the logged-in user
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("user not found");
      return res.json({
        success: false,
        message: "authentication error",
      });
    }

    // extract question id from req params
    const questionId = req.params.id;

    if (!questionId) {
      return res.json({
        success: false,
        message: "questionId is required",
      });
    }
    try {
      const singleQuestion = await Question.findById(questionId);
      return res.json({
        success: true,
        message: "question fetched successfully",
        question: singleQuestion,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Server Error");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server Error");
  }
};
const updateUserQuestion = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers["x-access-token"];

    // Check if the token is provided
    if (!token) {
      return res.status(400).json({ success: false, message: "Token not provided" });
    }

    // Decode the token to retrieve the user's email
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Get the email from the decoded token
    const userId = decoded.userId;

    const id = req.params.id;

    if (!req.body.question) {
      return res.json({ success: false, message: "Question is required" });
    }

    try {
      let questionImage;
      if (req.files) {
        questionImage = req.files.questionImage;
      }

      let updateQuestion = {
        question: req.body.question,
        questionDescription: req.body.questionDescription || "",
        user: userId,
      };

      // Check if an image was provided
      if (questionImage) {
        // Upload the image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(questionImage.path, {
          folder: "questions",
          crop: "scale",
        });
        updateQuestion.questionImageUrl = uploadedImage.secure_url;
      }

      await Question.findByIdAndUpdate(id, updateQuestion);
      const updatedQuestion = await Question.findById(id);

      return res.json({
        success: true,
        message: "UserQuestion updated successfully",
        question: updatedQuestion,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  getUserQuestion,
  updateUserQuestion,
};

