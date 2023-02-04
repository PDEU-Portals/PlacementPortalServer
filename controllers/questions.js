const mongoose = require('mongoose')
const Question = require('../models/Question')
const Quiz = require('../models/Quiz')
const Response = require('../models/Response')
const {HTTPResponse} = require('../utils/httpResponse')
const HTTPError = require('../utils/httpError')

exports.createQuestion = (async (req, res, next) => {
	const { quizId } = req.params;
	const { title, correct, options } = req.body;

	if ((!title, !correct, !options)) {
		return next(new HTTPError(res,400,'Please send Quiz, title, correct, options array',null));
	}

	options.forEach((option) => {
		if (!option.value) {
			return next(new HTTPError(res,400,'Please send all option with a value key in it.', null));
		}
	});

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		return next(new HTTPError(res,404,"Cannot add questions to a quiz that doesn't exist", null));
	}

	if (quiz.questionsCount > 9) {
		return next(new HTTPError(res,409,'A Quiz cannot have more that 10 questions.', null));
	}

	const question = await Question.create({
		quiz: quizId,
		title,
		correct,
		options
	});

	return res.status(200).json({
		status: 'success',
		question
	});
});

exports.getAllQuestion = (async (req, res, next) => {
	const { quizId } = req.params;
	const quiz = await Quiz.findById(quizId);
	const questions = await Question.find({ quiz: quizId }).select('-correct');

	if (!quiz) {
		return next(new HTTPError(res,404,'Quiz not found.', null));
	}

	return res.status(200).json({
		status: 'success',
		questions,
	});
});

exports.getQuestionsWithCorrectAns = (async(req,res,next) => {
    const { quizId } = req.params;
	const questions = await Question.find({ quiz: quizId }).select();

	if (questions.length === 0) {
		return res.status(200).json({
			status: 'success',
			message: 'No Question in this Quiz yet.'
		});
	}

	return res.status(200).json({
		status: 'success',
		questions,
	});
});

exports.getQuestion = (async(req,res) => {
    const { quizId, questionId } = req.params;

	const question = await Question.findOne({ _id: questionId, quiz: quizId });

	if (!question) {
		throw new HTTPError(res,404,emptyResponseMessages.NO_QUESTIONS_IN_QUIZ, null);
	}
	return res.status(200).json({
		status: 'success',
		question
	});
});

exports.updateQuestion = (async (req, res, next) => {
	const { quizId, questionId } = req.params;
	const { title, correct, options } = req.body;

	const questiontoUpdate = await Question.findOne({ _id: questionId, quiz: quizId });

	if (!questiontoUpdate) {
		return next(new HTTPError(res,404,errorMessages.RESOURCE_DOES_NOT_EXIST('Question'), null));
	}

	let shouldClearEarlierResponses = false;

	if (title) {
		questiontoUpdate.title = title;
	}

	if (correct) {
		if (questiontoUpdate.correct !== correct) {
			shouldClearEarlierResponses = true;
		}
		questiontoUpdate.correct = correct;
	}

	if (options) {
		if (!(options.length === 4)) return next(new HTTPError(res,400,'Please send only 4 options'), null);
		options.forEach((option, index) => {
			if (!option.value) {
				return next(new HTTPError(res,400,'Please send all option with a value key in it.', null));
			}
			if (options[index] !== questiontoUpdate.options[index]) {
				shouldClearEarlierResponses = true;
			}
		});
		questiontoUpdate.options = options;
	}

	if (shouldClearEarlierResponses) {
		console.log('delete responses');
		await Response.deleteMany({ questionId: questiontoUpdate._id });
	}

	questiontoUpdate.save();

	return res.status(200).json({
		status: 'success',
		question: questiontoUpdate
	});
});

exports.deleteQuestion = (async (req, res) => {
	const { quizId, questionId } = req.params;

	const question = await Question.findOneAndDelete({ _id: questionId, quiz: quizId });

	if (!question) {
		throw new HTTPError(res,404,"Question you are trying to delete doesn't exist.", null);
	}

	return res.status(204).json({
		status: 'success'
	});
});


