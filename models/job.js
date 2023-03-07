const mongoose = require("mongoose");

/**
 * Job Schema
 * 
 * Attributes:             Datatype
 * title                    String
 * description              String
 * jobType                  String
 * openings                 Number  Total Number of Openings for the Job
 * pref_branches            Array   Array of Strings containing the preferred branches
 * jobCreationDate          Date    Date on which the job was created
 * applicationDeadline      Date    Date on which the application for the job closes
 * location                 Array   Array of Strings containing the location of the job
 * salaryRange              Array   Array of Numbers containing the salary range of the job
 * skills                   Array   Array of Strings containing the skills required for the job
 * recruiterId              String  Id of the recruiter who created the job
 * applicants               Array   Array of Strings containing the ids of the applicants for the job
 * approved                 Boolean Whether the job has been approved by the admin or not
 * acceptingResponses       Boolean Whether the job is accepting responses or not
 * selectedApplicants       Array   Array of Strings containing the ids of the selected applicants for the job
 * 
 */

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
    location: [String],
    salaryRange: [Number],
    skills: [String],
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter"

    },
    applicants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    approved : {   // Whether the job has been approved by the admin or not
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