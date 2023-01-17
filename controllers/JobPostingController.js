
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const JobPosting = require('../models/JobPosting');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcryptjs')
const RecruiterController = require('./RecruiterController');

async function newJobPosting(req, res) {
    const recruiterId = getRecruiterId;
    const { headline, jobType, jobDescription, PrefBranches, deadline, userApplied, dateOfPosting } = req.body;
    try {
        const jobPosting = await JobPosting.create({ recruiterId, headline, jobType, jobDescription, PrefBranches, deadline, dateOfPosting, userApplied }, (err, result) => {
            if (err) throw err;
        });
        res.status(200).json(jobPosting);

    }
    catch (err) {
        res.status(400).json({ err: err.message });
    }
}

//Getting Job id
async function jobId(req, res){
    try {
        const jobId = await(JobPosting.findOne({ recruiterId, headline, dateOfPosting }))._id; //Can be used to parse in different queries for fetching apis
        if (!jobId) res.status(404).send({ err: "Cannot Find the Recruiter" });
        return jobId;
    }
    catch (err) {
        res.status(400).json({ err: err.message });
    }
}

async function getJobPosting(req, res){
    const recruiterId = RecruiterController.getRecruiterId(req, res);
    const { headline, dateOfPosting } = req.body;
    const jobId = await (JobPosting.findOne({ recruiterId, headline, dateOfPosting }))._id; //Can be used to parse in different queries for fetching apis
    const Job = await JobPosting.findOne({ recruiterId, headline, dateOfPosting }, (err, result) => {
        if (err) throw err;
        else return result;
    });
    return res.status(200).json({ jobId, Job });
}

module.exports = { newJobPosting, jobId, getJobPosting }