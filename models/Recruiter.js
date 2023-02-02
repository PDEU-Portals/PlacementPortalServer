const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobpost = require('../models/JobPosting');

/*
    Defining the Schema Pattern for Recruiter portal 

    Recruiter Schema

    Parameter   --->    Data Type   
    Headline            String
    Job/Internship      String
    Pref. Branches      String
    Full/Part-time      String
    Jobs Posted         array of Objects ( Fields : job_id String )  
*/

const RecruiterSchema = new Schema({
    CompanyName: { type: String },
    Description: { type: String },

    jobs_posted: [  {   type: Schema.Types.ObjectID,
                        ref: 'jobpost',
           }  ],//To be referenced from JobPost Model

    //The referenced JobPOst will contanin the deatils of all users who applued for the job
    jobsPosted: [  {   jobId : { type: String }   }  ]//To be referenced from JobPost Model
});


module.exports = mongoose.model('Recruiter', RecruiterSchema)