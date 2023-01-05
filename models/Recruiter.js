const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    jobs_posted: [  {   job_id : { type: String }   }  ]//To be referenced from JobPost Model
});


const Recruiter = mongoose.model ('recruiter', RecruiterSchema);
module.exports = User,Recruiter, Jobposting;