const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title"],
    },
    description: {
        type: String,
        required: [true, "Please enter a description"],
    },
    jobType:{
        type: String,
        required: [true, "Please enter a job type"],
        enum: ["Full-Time", "Internship"]
    },
    openings:{
        type: Number,
        required: [true, "Please enter the number of openings"],
        min: 1
    },
    pref_branches : [
        {
            type: String
        }
    ],
    jobCreationDate: {
        type: Date,
        default: Date.now(),
    },
    applicationDeadline: {
        type: Date,
        required: [true, "Please enter a deadline"],
    },
    location: Array[String],
    salaryRange: [Number],
    skills: Array[String],
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: "Recruiter"

    },
    applicants:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    approved : {
        type: Boolean,
        default: false
    },
    acceptingResponses: {
        type: Boolean,
        default: true
    },
    selectedApplicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

/*
the pre('save') hook is added to the jobSchema, which will run every time a job document is saved to the database.
Inside the hook function, the application deadline is compared to the current date (new Date()).
If the deadline has already passed, the acceptingResponses field is set to false.
The next() function is called at the end to continue the save operation.
*/
jobSchema.pre('save', function (next) {
    // Check if the application deadline has passed
    // Use this.getUpdate().$set.applicationDeadline || this.applicationDeadline
    if (this.getUpdate().$set.applicationDeadline <= new Date()) {
      this.acceptingResponses = false;
    }
    else{
        this.acceptingResponses = true; 
    }
    if (this.getUpdate().$set.applicationDeadline <= new Date()) {
        return next(new Error('Cannot update applicants after application deadline has passed'));
      }
    next();
  });

module.exports = mongoose.model("Job", jobSchema);