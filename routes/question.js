const express = require('express')
const router = express.Router()
const {
    getAllQuestion,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsWithCorrectAns
} = require('../controllers/questions')

router.route('/correct').get(getQuestionsWithCorrectAns);
router.route('/:questionId').get(getQuestion);
router.route('/').get(getAllQuestion).post(createQuestion);
questionRouter.route('/:questionId').patch(updateQuestion).delete(deleteQuestion);

module.exports = router