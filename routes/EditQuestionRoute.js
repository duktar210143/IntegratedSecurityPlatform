const express = require('express');
const router = express.Router();

const editQuestionController = require("../controllers/EditquestionController");

// route to Posting question to the database
router.get('/getUserQuestion/:id',editQuestionController.getUserQuestion);

router.put("/updateUserQuestion/:id", editQuestionController.updateUserQuestion)
module.exports = router;

