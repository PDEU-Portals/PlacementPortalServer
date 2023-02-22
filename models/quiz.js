const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required: true
    },
    answers:{
        type: [String],
        required: true
    },
    correctAnswer: String
})

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    questions:{
        type: [questionSchema],
        required: true
    },
    score: Number
})

const Question = mongoose.model('Question', questionSchema)
const Quiz = mongoose.model('Quiz',quizSchema)

module.exports = {
    Question,
    Quiz
}