const express = require('express');
const router = express.Router();
const {
    getAllQuizes,
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quiz')

const {
    createAttempt,
    getAttemptById,
    getAttemptsByUser
} = require('../controllers/attempt')

router.route('/attempts/').get(getAttemptsByUser);
router.route('/attempts/:attemptId').get(getAttemptById);
router.route('/quiz').get(getAllQuizes).post(createQuiz);
router.route('/quiz/:quizId').get(getQuiz);
router.route('/quiz/:quizId/attempts/save-score').post(createAttempt);

router.route('/quiz/:quizId').patch(updateQuiz).delete(deleteQuiz);

module.exports = router