
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const JobPosting = require('../models/JobPosting');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcryptjs')

const newJobPosting = async(req, res)=>{
    const recruiter_id = getRecruiterid;
    const {headline, job_type,job_description, Pref_branches, deadline, user_applied, dateOfPosting} = req.body;
    try{
        const job_posting = await JobPosting.create({recruiter_id, headline, job_type, job_description, Pref_branches, deadline, dateOfPosting, user_applied}, (err, result)=>{
            res.status(200).send("Job Posted");
            res.status(200).json(result);
        });
        res.status(200).json(job_posting);

    }
    catch(err){
        res.status(400).json({err: err.message});
    }
}

//Getting Job id
const job_id = (req,res)=>{
    try{
    const job_id = await (JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}))._id; //Can be used to parse in different queries for fetching apis
    return job_id;
}
    catch(err){
        res.status(400).json({err: err.message});
    }
}

const getJobPosting = async(req, res)=>{
    const Recruiter_id = getRecruiterid;
    const { headline, dateOfPosting  } = req.body;
    try{
        const job_id = await (JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}))._id; //Can be used to parse in different queries for fetching apis
        const Job = await JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}, (err, result)=>{
            res.status(200).json(result);
        });
        res.status(200).json(Job);
       return res.status(200).json(job_id);
    }
    catch(err){
        res.status(401).send({err: err.message})
        // res.status(400).send({err: "Cannot Find the Recruiter"})
    }
}

module.exports= {newJobPosting, job_id, getJobPosting}