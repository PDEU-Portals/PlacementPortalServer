const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*
    Add link to database in .env file after doing necessary stuff wrt MongoDB
    
    ------------------------------------------------------------------------------------

    
    As listed in the image sent in wp group, am defining the Schema as follows:
    
    Parameter   --->    Data Type defined in schema     --->     Reason
    Name                    String                               Because it's an individual's name
    RollNo                  String                               Based on our Roll Numbers
    DOB                     Date                                 Frontend will return Date object
    Skills                  array of strings                     I guess it would be better to have skills in the form of array of strings as it would make insertion and deletion easier
    Projects                array of Objects                     { Name: "", TechStack: "", TimeStamps: "", Link: "",}
    SGPA                    Array of 8 Numbers                   Because SGPA can be of float, double or int, but can't have alphabets in it
    work experience         Array of Objects                     {CompanyName: String, Designation: String, StartDate: Date, EndDate: Date,}
    publications            array of Objects                     {Name: String, Link: String}
    socialMediaHandles      Array of Objects                     {Name: String, Link: String}}              
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
        approval            boolean
        )

*/

const userSchema = new Schema({
    // userName: {
    //     type: String,
    //     // required: [true, 'Please enter your name'],
    // },   --> userName is not NECESSARY!!!!
    name: { type: String },
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
        type: Date,
    },
    skills: {
        type: [String],
    },
    projects: {
        type: [{
            Name: "",
            TechStack: "",
            TimeStamps: "",
            Link: "",
        }],
    },
    SGPA: {
        type: [Object],
        validate: [{
            validator: function (v) {
                return v.length <= 8;
            },
            message: 'SGPA can have a maximum of 8 semesters'
        }]
    },
    CGPA: {
        type: Number
    },
    workExperience: {
        type: [{
            CompanyName: String,
            Designation: String,
            StartDate: Date,
            EndDate: Date,
        }]
    },
    publications: {
        type: [{
            Name: String,
            Link: String,
        }], // format: {name: "", link: ""}
    },
    phoneNumber: { type: Number },
    socialMediaHandles: {
        type: [{
            Name: String,
            Link: String,
        }],
    },

    jobs_applied: [
        {
            type: Schema.Types.ObjectID,
            // ref: 'jobPost'
            //         recruiter_id: {type: String},
            //         job_id : {type: String},
            //         date_of_submission: {type: Date}
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    }
});

// will run before save and create
userSchema.pre('save', function (next) {
    if (this.SGPA.length) {
        this.CGPA = this.SGPA.reduce((a, b) => a + b) / this.SGPA.length;
    }
    next();
});

// will run before update
userSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.SGPA && this._update.SGPA.length) {
        let CGPA = 0;
        for (let i = 0; i < this._update.SGPA.length; i++) {
            CGPA += Number(this._update.SGPA[i]);
        }
        this._update.CGPA = (CGPA / this._update.SGPA.length).toFixed(2);
    }
    next();
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