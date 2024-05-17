const express = require('express');
const router = express.Router();

const QuestionController = require("../controllers/QuestionController")

const editQuestionController = require("../controllers/EditquestionController");

const replyController = require("../controllers/QuestionReplyController");

// route to Posting question to the database
router.post('/setQuestions',QuestionController.createQuestionController);

// route for fetching questions from database
router.get('/getQuestions',QuestionController.fetchQuestionController)

router.get('/getUserQuestion/:id',editQuestionController.getUserQuestion);

router.put("/updateUserQuestion/:id", editQuestionController.updateUserQuestion)

router.delete("/deleteQuestion/:id",QuestionController.deleteQuestion);

// reply route 
router.post("/setReply/:questionId",replyController.questionReplyController)

// getting all the question specific replies route
router.get("/getReplies/:questionId",replyController.getQuestionSpecificReply)

router.get("/getAllQuestions",QuestionController.fetchAllQuestions)

module.exports = router;

