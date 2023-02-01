const Attempt = require('../models/Attempt')
const Response = require('../models/Response')
const HTTPError = require('../utils/httpError')

exports.createAttempt = (async (req, res, next) => {
	const { score, responses } = req.body;
	const { quizId } = req.params;
	const userId = req.user.id;

	if (!quizId || !score.toString()) {
		return next(new HTTPError(res,400,'Please responses array and score.', null));
	}

	if (!Array.isArray(responses)) {
		return next(new HTTPError(res,400,'Please responses as an array.', null));
	}
	if (!(responses.length > 0)) {
		return next(new HTTPError(res,400, 'Please do not send empty response.', null));
	}

	const attemptExists = await Attempt.exists({ userId, quiz: quizId });

	const attempt = await Attempt.create({ userId, quiz: quizId, score });

	if (!attemptExists) {
		console.log('Not Exists.');
		const createdResponses = await Promise.all(
			responses.map((response) => {
				return Response.create({
					userId,
					quiz: quizId,
					attempt: attempt._id,
					questionId: response._id,
					question: {
						title: response.title,
						options: response.options,
						response: response.response,
						correct: response.correct
					}
				});
			})
		);

		return res.status(200).json({
			status: 'success',
			attempt,
			responses: createdResponses
		});
	} else {
		return res.status(200).json({
			status: 'success',
			attempt
		});
	}
});

exports.getAttemptsByUser = (async (req, res) => {
	const paginationSize = 6;
	const { page } = req.query;
	const userId = req.user.id;
	const attempts = await Attempt.find({ userId })
		.populate({
			path: 'quiz',
			select: '+deleted'
		})
		.limit(paginationSize)
		.skip(paginationSize * ((page || 1) - 1))
		.sort('-createdAt');
	const count = await Attempt.countDocuments({ userId });

	return res.status(200).json({
		status: 'success',
		count,
		attempts
	});
});

exports.getAttemptById = (async (req, res, next) => {
	const { attemptId } = req.params;
	const userLoggedInId = req.user.id;

	const attempt = await Attempt.findOne({ _id: attemptId }).populate({
		path: 'quiz',
		select: '+deleted'
	});

	if (!attempt) {
		return next(new HTTPError(res,404,'Attempt not found', null));
	}
	// console.log({ userLoggedInId, attemptUserId: attempt.userId, quizAuthor: attempt.quiz.author });
	if (attempt.quiz.author !== userLoggedInId && attempt.userId !== userLoggedInId) {
		return next(new HTTPError(res,403,errorMessages.ACCESS_DENIED, null));
	}

	const userId = attempt.userId;

	const responses = await Response.find({
		quiz: attempt.quiz._id,
		attempt: attempt._id,
		userId
	}).sort({
		createdAt: 1
	});

	return res.status(200).json({
		status: 'success',
		attempt,
		responses
	});
});