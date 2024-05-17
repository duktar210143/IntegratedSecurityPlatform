const jwt = require("jsonwebtoken");
const Question = require("../models/Question.model");
const User = require("../models/User.model");
const cloudinary = require("cloudinary");
const Reply = require("../models/Reply.model");

const createQuestionController = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const { question, questionDescription, questionCategory } = req.body;
    if (!question) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    let questionImage;
    if (req.files && req.files.questionImage) {
      questionImage = req.files.questionImage;

      // upload image to cloudinary
      const uploadedImage = await cloudinary.v2.uploader.upload(
        questionImage.path,
        {
          folder: "questions",
          crop: "scale",
        }
      );

      const newQuestion = new Question({
        question: question,
        questionDescription: questionDescription,
        questionCategory: questionCategory,
        questionImageUrl: uploadedImage.secure_url,
        user: user._id,
      });

      const savedQuestion = await newQuestion.save();

      const populatedQuestion = await Question.findById(
        savedQuestion._id
      ).populate("user", [
        "firstname",
        "lastname",
        "username",
        "email",
        "image",
      ]);

      const allUserQuestions = await Question.find({ user: user._id }).populate(
        "user",
        ["firstname", "lastname", "username", "email", "image"]
      );

      return res.json({
        success: true,
        question: populatedQuestion,
        questions: allUserQuestions,
      });
    } else {
      const newQuestion = new Question({
        question: question,
        questionDescription: questionDescription,
        questionCategory: questionCategory,
        user: user._id,
      });

      const savedQuestion = await newQuestion.save();

      const populatedQuestion = await Question.findById(
        savedQuestion._id
      ).populate("user", ["firstname", "lastname", "username", "email"]);

      const allUserQuestions = await Question.find({ user: user._id }).populate(
        "user",
        ["firstname", "lastname", "username", "email"]
      );

      return res.json({
        success: true,
        question: populatedQuestion,
        questions: allUserQuestions,
      });
    }
  } catch (error) {
    console.error("Error creating question:", error);
    return res.json({
      success: false,
      message: "Couldn't create the question",
      error: error.message,
    });
  }
};

// Fetch questions for a user with a valid token
const fetchQuestionController = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User doesn't exist" });
    }

    const questions = await Question.find({ user: user._id }).populate([
      {
        path: "user",
        select: ["firstname", "lastname", "username", "email", "image"],
      },
      {
        path: "replies", // Populate the replies
        select: ["reply"],
      },
    ]);

    return res.json({ success: true, questions: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.json({
      success: false,
      message: "An error occurred while fetching questions",
      error: error.message,
    });
  }
};

// get questions without the token

// Fetch questions for a user with a valid token
const fetchAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate([
      {
        path: "user",
        select: ["firstname", "lastname", "username", "email", "image"],
      },
      {
        path: "replies", // Populate the replies
        select: ["reply"],
      },
    ]);

    return res.json({ success: true, questions: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.json({
      success: false,
      message: "An error occurred while fetching questions",
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers["x-access-token"];

    // Check if the token is provided
    if (!token) {
      console.log("token not provided");
      return res.status(400).json({ message: "Token not provided" });
    }

    // Decode the token to retrieve the user's email
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Get the email from the decoded token
    const userId = decoded.userId;

    // Find the logged-in user
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("user not found");
      return res.json({
        success: false,
        message: "Authentication error",
      });
    }

    const questionId = req.params.id;

    // Check if questionId is provided
    if (!questionId) {
      return res.json({
        success: false,
        message: "Question ID not provided",
      });
    }

    // Find the question by its ID
    const question = await Question.findById(questionId);

    // If the question doesn't exist, throw an error
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    // Find and delete all replies associated with the question
    await Reply.deleteMany({ question: questionId });

    return res.json({
      success: true,
      message: "Question deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};



module.exports = {
  createQuestionController,
  fetchQuestionController,
  fetchAllQuestions,
  deleteQuestion
};
