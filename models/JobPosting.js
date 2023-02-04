
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require('../models/user');
const recruiter = require('../models/Recruiter');

/*
    Defining the Schema Pattern for Job Applying portal 

    JobPosted Schema

    Parameter   ----->>     Data Type
    _id                  String (To be Referenced from Recruiter Schema)
    date_posted             Date
    user_applied            Array (Fields : 
        user_id,            String
        Submission_date,    String
        pproval             boolean
        )

*/

const JobPost = new Schema({
    recruiter_id : { type: Schema.Types.ObjectID, ref: 'recruiter._id'}, //To be referenced from Recruiter Schema
    job_id : { type: String },
    headline : {type: String},
    job_type : {type: String}, //Part-time/fulltime etc
    job_description : {type: String},
    Pref_branches : [{ type: String }], //Array of Strings
    deadline : {type: Date},
    dateofPosting : {type: Date},
    approved : {type: Boolean},
    users_applied : [  {  type: Schema.Types.ObjectID, ref: 'users._id' , dateofSubmission: {type: Date}, approved: Boolean  }  ]
});

//

const Jobposting = mongoose.model ('jobpost', JobPost);

module.exports = Jobposting;