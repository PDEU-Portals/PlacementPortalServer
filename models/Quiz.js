const mongoose = require('mongoose')

const quizSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Quiz title required']
		},
		description: {
			type: String,
			default: 'No Description'
		},
		tags: [
			{
				type: String,
				required: [true, 'Tags are required']
			}
		],
		status: {
			type: String,
			default: 'draft',
			enum: ['draft', 'active', 'inactive']
		},
		deleted: {
			type: Boolean,
			default: false,
			select: false
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);

quizSchema.virtual('questions', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id'
});

quizSchema.virtual('questionsCount', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id',
	count: true
});

quizSchema.virtual('attemptsCount', {
	ref: 'Attempt',
	foreignField: 'quiz',
	localField: '_id',
	count: true
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);