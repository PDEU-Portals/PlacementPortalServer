const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
	{
		quiz: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			required: [true, 'A question has to be associated with a quiz required']
		},
		title: {
			type: String,
			required: [true, 'Question title required']
		},
		correct: {
			type: String,
			required: [true, 'Correct option required']
		},
		options: {
			type: [{ value: String }],
			validate: [arrayLimit, 'length should only be 4']
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);

function arrayLimit(val) {
	return val.length === 4;
}