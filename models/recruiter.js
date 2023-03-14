const mongoose = require("mongoose");


const recruiterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
    },
    password:{
        type: String,
    },
    jobs:[{
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job'
            }
        }],
    isCurrentRecruiter:{
        type: Boolean,
        default: true,
    }
    // selected applicants is available in Job Schema
    // details can be fetched using populate() method
});

module.exports = mongoose.model('Recruiter', recruiterSchema)
