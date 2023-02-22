const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
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
    phoneNumber: {
        type: Number
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
        type: [Number],
        validate: {
            validator: function (v) {
                return v.length <= 8;
            }
        }
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
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Job'
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    isEligibleForPlacement: {
        type: Boolean,
        default: true
    },
    accountAccess: {
        type: Boolean,
        default: true
    },
    quiz: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Quiz'
        },
    ]
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

module.exports = mongoose.model('User', userSchema)