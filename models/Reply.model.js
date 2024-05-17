const mongoose = require('mongoose')

const QuestionReply = new mongoose.Schema(
    {
        reply:{
            type:String,
            required:true,
            trim:true,
        },
        replyImgUrl:{
            type:String,
            trim:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user-data",
        },
        question:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User-Question"
        },
    },
    {
        collection:"Question-Reply",
    }
);

const replyModel = mongoose.model("Question-Reply",QuestionReply)

module.exports = replyModel;
