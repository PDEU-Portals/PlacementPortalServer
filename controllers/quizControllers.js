const {Question, Quiz} = require('../models/Quiz');

exports.addQuestions = async(req,res) => {
    try {
        const {question, answers, correctAnswer} = req.body

        await Question.create({
            question,
            answers,
            correctAnswer
        })

        const data = await Question.find({})
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.createQuiz = async(req,res) => {
    try {
        const questions = await Question.aggregate([{ $sample: { size: 2 } }]);
        res.status(200).send(questions)
    } catch (error) {
        console.log(error)
    }
}

exports.submitQuiz = async(req,res) => {
    try {
        const {questions, score} = req.body

        await Quiz.create({
            questions,
            score
        })

        const data = await Quiz.find({})

        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}