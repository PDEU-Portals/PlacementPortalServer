// all functions in the file are only for recruiter
// other job related functions for students(user) will be introduced in other file
const Recruiter = require('../models/recruiter')
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const recruiter = require('../models/recruiter');

exports.loginRecruiter = async (req, res) => {
    const { email, password } = req.body;
    try {
        const recruiter = await Recruiter.findOne({ email });
        // console.log(recruiter)
        if (!recruiter) {
            return res.status(401).json({ message: "Email ID or password Incorrect" });
        }
        // const isMatch = bcrypt.compare(password, recruiter.password);
        const isMatch = password === recruiter.password
        if (!isMatch) {
            return res.status(401).json({ message: "Email ID or password Incorrect" });
        }
        if(recruiter.isCurrentRecruiter === false) return res.status(401).json({ message: "You are not a allowed to access the portal. Contact Admin" });
        const token = jwt.sign({ email, id: recruiter._id }, process.env.JWT_RECRUITER_SECRET, {
            expiresIn: "1d"
        });
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 24,
            signed: true,
        });
        // return res.sendStatus(200);
        return res.status(200).json({
            recruiter,
            token
        })
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", err: err.message });
    }
}

exports.getDetails = async(req,res) =>{
    try {
        const id = req.params.id;
        const recruiter = await Recruiter.findById(id)
        
        res.status(200).json(recruiter)
    } catch (error) {
        console.log(error)
    }
}

exports.logOutRecruiter = async (req, res) => {
    if (req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
}

exports.addDetails = async(req,res) => {
    const id = req.body.id;
    const { companyName, companyDescription, companyWebsite, companyLinkedin, companyTwitter, additionalInfo} = req.body;
    let myObj = {};
    if (companyName) myObj.companyName = companyName;
    if (companyDescription) myObj.companyDescription = companyDescription;
    if (companyWebsite) myObj.companyWebsite = companyWebsite;
    if (companyLinkedin) myObj.companyLinkedin = companyLinkedin;
    if (companyTwitter) myObj.companyTwitter = companyTwitter;
    if (additionalInfo) myObj.additionalInfo = additionalInfo;
    Recruiter.findByIdAndUpdate(id, myObj, {
        new: true,
        select: '-_id -password'
    }, (err, recruiter) => {
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!recruiter) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(recruiter);
    }
    );
}

// apply middleware authenticate token
exports.getRecruiter = async (req, res) => {
    const id = req.body.id;
    Recruiter.findById(id, '-password -__v', (err, recruiter) => {   // remove password and _id from response
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
        return res.json(recruiter);
    });
}

exports.createJob = async (req, res) => {
    const { title, description, jobType, openings, pref_branches, location, salaryRange, skills, applicationDeadline } = req.body;
    // if (!title || !description || !jobType || !openings || !pref_branches || !location || !salaryRange || !skills || applicationDeadline) {
    //     return res.status(400).json({ message: "Please enter all fields" });
    // }
    try {
        const job = await Job.create({
            title,
            description,
            jobType,
            openings,
            pref_branches,
            applicationDeadline,
            location,
            salaryRange,
            skills,
            recruiterId: req.body.id,
        });
        await Recruiter.findOneAndUpdate({ _id: req.body.id }, { $push: { jobs: job._id } })
        return res.status(200).json({ message: "Job created successfully", job });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", err:err.message });
    }
}

exports.getJobs = async (req, res) => {
    const id = req.params.id;
    let appliedJobs = await Recruiter.findById(id, "appliedJobs");
    if (!appliedJobs) appliedJobs = [];
    const jobs = await Job.find({
         _id: { $nin: appliedJobs } 
        }, "-__v -applicants -approved -selectedApplicants", { 
            sort: { 
                acceptingResponses: -1, 
                jobCreationDate: 1 
            }
        });
    return res.status(200).json(jobs);
}

exports.getJob = async (req, res) => { // get a job by recruiter
    const id = req.params.id;
    // console.log(id)
    try {
        // console.log("hit")
        const job = await Job.findById(id, '-__v');
        const recruiter = await Recruiter.findById(job.recruiterId)
        if(!job) return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({job,recruiter});
    } catch(err){
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.modifyJob = async (req, res) => {
    // ask Frontend to send jobId with request
    const jobId = req.body.jobId;
    const { title, description, jobType, openings, pref_branches, location, salaryRange, skills, applicationDeadline } = req.body;
    if (!title || !description || !jobType || !openings || !pref_branches || !location || !salaryRange || !skills || applicationDeadline) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            jobType,
            openings,
            pref_branches,
            applicationDeadline,
            location,
            salaryRange,
            skills,
        });
        return res.status(200).json({ message: "Job updated successfully" });
    } catch (err) {
        const message = err.message || "Something went wrong";
        return res.status(500).json({ message });
    }
}

exports.deleteJob = async (req, res) => {
    const jobId = req.params.jobId;
    try {
        // await Job.findByIdAndDelete(jobId, (err, job) => {
        //     if (err) throw err;
        //     if (!job) return res.status(404).json({ message: "Job not found" });
        //     const recruiterId = job.recruiterId;
        //     Recruiter.findByIdAndUpdate(recruiterId, {
        //         $pull: { jobs: jobId }
        //     });
        // });
        const job = await Job.findByIdAndDelete(jobId)
        if (!job) return res.status(404).json({ message: "Job not found" });
        const recruiterId = job.recruiterId
        await Recruiter.findByIdAndUpdate(recruiterId,{
            $pull: {jobs: jobId}
        })
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        const message = err.message || "Something went wrong";
        return res.status(500).json({ message });
    }
}

// add to and remove from selected applicants

exports.addSelectedApplicant = async (req, res) => {
    // ask Frontend to send userId and jobId with request
    const { userId, jobId } = req.body.userId;
    try {
        if(!userId || !jobId) return res.status(400).json({ message: "Please enter all fields" });
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if(job.selectedApplicants.includes(userId)) return res.status(400).json({ message: "User already selected" });
        job.selectedApplicants.push(userId);
        await job.save();
        return res.status(200).json({ message: "User added to selected applicants" });
    } catch (err) {
        const message = err.message || "Something went wrong";
        return res.status(500).json({ message });
    }
}

exports.removeSelectedApplicant = async (req, res) => {
    const { userId, jobId } = req.body.userId;
    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if(!job.selectedApplicants.includes(userId)) return res.status(400).json({ message: "User not selected" });
        job.selectedApplicants.pull(userId);
        await job.save();
    } catch(err){
        const message = err.message || "Something went wrong";
        return res.status(500).json({ message });
    }
}