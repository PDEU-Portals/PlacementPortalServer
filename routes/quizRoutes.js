const express = require('express')
const router = express.Router()
const {addQuestions, createQuiz, submitQuiz} = require('../controllers/quizControllers')

router.post("/add", addQuestions)
router.get("/qq", createQuiz)
router.post("/submit", submitQuiz)

module.exports = router