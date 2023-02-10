// const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const jobPost = require('../models/JobPosting');
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

/*
    Add link to database in .env file after doing necessary stuff wrt MongoDB
    
    ------------------------------------------------------------------------------------

    
    As listed in the image sent in wp group, am defining the Schema as follows:
    
    Parameter   --->    Data Type defined in schema     --->     Reason
    Name                    String                               Because it's an individual's name
    RollNo                  String                               Based on our Roll Numbers
    DOB                     String                               To give flexibility to users
    Skills                  array of strings                     I guess it would be better to have skills in the form of array of strings as it would make insertion and deletion easier
    Projects                array of strings                     I guess it would be better to have projects in the form of array of strings as it would make insertion and deletion easier       
    CGPA                    Number                               Because cgpa can be of float, double or int, but can't have alphabets in it
    work experience         Number                               Because work experience can be of half a year, or of 2.5 years and so on
    publications            array of strings                     Because we can add links to multiple publications
    contacts                defined as shown in Schema           For convenience              
*/
/* 
    For making effective data read, normalization of the Database with 3 Schemas (UserSchema, RecruiterSchema, JobPostedSchema)

*/
/*
    Defining the Schema Pattern for Recruiter portal 

    Recruiter Schema

    Parameter   --->    Data Type   
    Headline            String
    Job/Internship      String
    Pref. Branches      String
    Full/Part-time      String
    Jobs Posted         array of Objects ( Fields : job_id String )  
        
    
    JobPosted Schema

    Parameter   ----->>     Data Type
    Rec_id                  String (To be Referenced from Recruiter Schema)
    date_posted             Date
    user_applied            Array (Fields : 
        user_id,            String
        Submission_date,    String
        pproval             boolean
        )

*/

const userSchema = new Schema({
    // userName: {
    //     type: String,
    //     // required: [true, 'Please enter your name'],
    // },   --> userName is not NECESSARY!!!!
    name : {type: String},
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    username: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    },
    rollNo: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    skills: {
        type: [String],
    },
    projects: {
        type: [{
            Name: "",
            Tech_Stack: "",
            TimeStamps: "",
            Link: "",
        }],
        /*
        array of objects
        1) name
        2) tech stack
        3) timestamps
        4) github link
        */
    },
    CGPA: {
        type: String,
    },
    workExperience: {
        role: String,
        description: String,
    },
    publications: {
        type: [String],
    },
    phoneNumber: {type: Number},
    socialMediaHandles: {
        type: [String],
    },

    jobs_applied : [
        {
            type: Schema.Types.ObjectID,
            // ref: 'jobPost'
    //         recruiter_id: {type: String},
    //         job_id : {type: String},
    //         date_of_submission: {type: Date}
        }
    ]
});



//Recruiter Schema
// const RecruiterSchema = new Schema({
//     CompanyName: { type: String },
//     Description: { type: String },

//     jobs_posted: [  {   job_id : { type: String }   }  ]//To be referenced from JobPost Model
// });


//Job posting schema
// const JobPost = new Schema({
//             recruiter_id : { type: String }, //To be referenced from Recruiter Schema
//             job_id : { type: String },
//             headline : {type: String},
//             job_type : {type: String},
//             job_description : {type: String},
//             Pref_branches : [{ type: String }], //Array of Strings
//             deadline : {type: Date},
//             dateofPosting : {type: Date},
//             approved : {type: Boolean},
//             users_applied : [  {  user_id: {type:String}, dateofSubmission: {type: String}  }  ]
// });
// const JobPost = new Schema({
//             recruiter_id : { type: String }, //To be referenced from Recruiter Schema
//             jobId : { type: String },
//             headline : {type: String},
//             jobType : {type: String},
//             jobDescription : {type: String},
//             PrefBranches : [{ type: String }], //Array of Strings
//             deadline : {type: Date},
//             dateOfPosting : {type: Date},
//             approved : {type: Boolean},
//             users_applied : [  {  user_id: {type:String}, dateOfSubmission: {type: String}  }  ]
// });


// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       next();
//     }
  
//     this.password = await bcrypt.hash(this.password, 10);
// });


// userSchema.methods.getJwtToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_TIME
//     })
// }

// //Compare user password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// }

// const User = mongoose.model('users', userSchema);
// const Recruiter = mongoose.model ('recruiter', RecruiterSchema);
// const Jobposting = mongoose.model ('jobpost', JobPost);
// const Recruiter = mongoose.model ('recruiter', RecruiterSchema);
// const JobPosting = mongoose.model ('jobPost', JobPost);

// module.exports = User,Recruiter, JobPosting;

module.exports = mongoose.model('User', userSchema)