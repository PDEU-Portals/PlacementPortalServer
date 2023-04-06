const mongoose = require('mongoose');

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
            Description:String
        }]
    },
    publications: {
        type: [{
            Name: String,
            Link: String,
        }], // format: {name: "", link: ""}
    },
    phoneNumber: { type: Number },
    socialMediaHandles:[
        {
            name:String,
            link: String
        }
    ],

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
    ],
    experience:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Experience'
        }
    ],
    resume:[
        {
            id:{
                type: String
            },
            secure_url:{
                type:String
            },
            url:{
                type:String
            }
        }
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