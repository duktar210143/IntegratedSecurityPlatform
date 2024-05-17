const User = require("../models/User.model");
const Reply = require("../models/Reply.model");
const Question = require("../models/Question.model");
const jwt = require("jsonwebtoken");

const questionReplyController = async (req, res) => {

  const token = req.headers["x-access-token"];
  try {
    // Check if the token is provided
    if (!token) {
      console.log("token not provided");
      return res
        .status(404)
        .json({ success: false, message: "Token not provided" });
    }

    try {
      // Decode the token to retrieve the user's email
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

      // Get the userId from the decoded token
      const username = decoded.username;

      const user = await User.findOne({ username: username });

      if (!user) {
        console.log("User not found");
        return res.json({
          success: false,
          message: "Authentication error: User not found",
        });
      }

      //   get the question id from the request parameter
      const questionId = req.params.questionId;

      const question = await Question.findOne({ _id: questionId });
      if (!question) {
        console.log("User not found");
        return res.json({
          success: false,
          message: "Authentication error: question not found",
        });
      }

      const { reply } = req.body;

      const newReply = new Reply({
        reply: reply,
        question: question._id,
        user: user._id,
      });

      const savedReply = await newReply.save();

      await Question.findByIdAndUpdate(
        question._id,
        { $push: { replies: savedReply._id } },
        { new: true }
      );

      const populatedReply = await Reply.populate(savedReply, [
        { path: "user", model: "user-data" },
        {path: "question",model:"User-Question"}
      ]);

      const users = await User.find();

      res.json({
        success: true,
        message: "Reply saved successfully",
        reply: populatedReply,
        users:users
      });
    } catch (tokenError) {
      console.log(tokenError);
      res
        .status(401)
        .json({ success: false, message: "Token verification failed" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Couldn't upload the reply" });
  }
};


const getQuestionSpecificReply = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      const username = decoded.username;
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.json({
          success: false,
          message: "Authentication error: User not found",
        });
      }

      const questionId = req.params.questionId;

      if (!questionId) {
        return res.json({
          success: false,
          message: "Couldn't find questionId",
        });
      }

      const replies = await Reply.find({ question: questionId })
        .populate("user", ""); // Adjust fields as needed

      return res.json({ success: true, replies: replies });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  questionReplyController,
  getQuestionSpecificReply,
};

module.exports = {
  questionReplyController,
  getQuestionSpecificReply,
};
