const Attempt = require('../models/Attempt')
const Quiz = require('../models/Quiz');
const HTTPError = require('../utils/httpError');

exports.getAllQuizes = (async (req, res) => {
	const paginationSize = 6;

	const { search, tag, page } = req.query;

	const filters = {
		deleted: { $ne: true }
	};
	if (search) {
		filters.title = {
			$regex: search,
			$options: 'i'
		};
	} else if (tag) {
		filters.tags = { $in: [tag] };
	} else {
		filters.status = 'active';
	}
	const quizes = await Quiz.find({ ...filters })
		.populate('questionsCount attemptsCount')
		.limit(paginationSize)
		.skip(paginationSize * ((page || 1) - 1))
		.sort('-createdAt');
	const count = await Quiz.countDocuments({ ...filters });
	return res.status(200).json({
		status: 'success',
		quizes,
		count
	});
});

exports.createQuiz = (async (req, res, next) => {
	const { title, description, tags, status } = req.body;

	console.log({ title, description });

	if (!title || !description || !tags || !author) {
		return next(new HTTPError(res,400,'Please send Quiz title, description, tags and author.', null));
	}

	if (!Array.isArray(tags)) {
		return next(new HTTPError(res,400,'Please send tags as array.', null));
	}

	if (!(tags.length >= 1)) {
		return next(new HTTPError(res,400,'Please send at least 1 tag in array.', null));
	}

	const quiz = await Quiz.create({
		title,
		description,
		tags,
		status: status
	});

	return res.status(200).json({
		status: 'success',
		quiz: quiz
	});
});

exports.getQuiz = (async (req, res, next) => {
	const { quizId } = req.params;

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		return next(new HTTPError(res,404,'Quiz not found', null));
	}

	return res.status(200).json({
		status: 'success',
		quiz: quiz
	});
});

exports.updateQuiz = (async (req, res, next) => {
	const { title, description, tags, status } = req.body;
	const { quizId } = req.params;
	const toUpdateData = {};

	if (title) {
		toUpdateData.title = title;
	}

	if (description) {
		toUpdateData.description = description;
	}

	if (tags) {
		if (!(tags.length >= 1)) return next(new HTTPError(res,400,'Please send at least 1 tag.'), null);
		toUpdateData.tags = tags;
	}

	if (status) {
		toUpdateData.status = status;
	}

	const updatedQuiz = await Quiz.findOneAndUpdate({ _id: quizId }, toUpdateData, {
		new: true,
		runValidators: true
	});

	return res.status(200).json({
		status: 'success',
		quiz: updatedQuiz
	});
});

exports.deleteQuiz = (async (req, res) => {
	const { quizId } = req.params;

	const attempts = await Attempt.findOne({ quiz: quizId });

	if (!attempts) {
		await Quiz.findOneAndDelete({ _id: quizId });
		return res.status(204).json({
			status: 'success'
		});
	}
	const quiz = await Quiz.findOneAndUpdate({ _id: quizId }, { deleted: true });

	if (!quiz) {
		throw new HTTPError(res,404,"Quiz you are trying to delete doesn't exist.", null);
	}

	return res.status(204).json({
		status: 'success'
	});
});