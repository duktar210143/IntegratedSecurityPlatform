const mongoose = require("mongoose");

// create a model for user specific questions
const UserQuestions = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    questionDescription: {
      type: String,
      trim: true,
    },
    questionCategory: {
      type: String,
      trim: true,
    },
    questionImageUrl: {
      type: String,
      trim: true,
    },

    // refrence of user that crated the question
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-data",
    },

    // reference of repllies to the questions
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question-Reply',
      },
    ],
  },
  {
    collection: "User-Questions",
  }
);

// export the question model
const questionModel = mongoose.model("User-Question", UserQuestions);

module.exports = questionModel;
