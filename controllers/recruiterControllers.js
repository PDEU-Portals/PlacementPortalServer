// all functions in the file are only for recruiter
// other job related functions for students(user) will be introduced in other file
const Recruiter = require('../models/recruiter')
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginRecruiter = async (req, res) => {
    const { email, password } = req.body;
    try {
        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(401).json({ message: "Email ID or password Incorrect" });
        }
        const isMatch = bcrypt.compare(password, recruiter.password);
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
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.logOutRecruiter = async (req, res) => {
    if (req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
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
    if (!title || !description || !jobType || !openings || !pref_branches || !location || !salaryRange || !skills || applicationDeadline) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
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
        return res.status(200).json({ message: "Job created successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getJobs = async (req, res) => { // get all jobs by recruiter
    const recruiterId = req.body.id;
    try {
        const jobs = await Job.find({ recruiterId: recruiterId }, '-_id -__v').sort({ jobCreationDate: -1 });
        return res.status(200).json({ jobs });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getJob = async (req, res) => { // get a job by recruiter
    const jobId = req.body.jobId;
    try {
        const job = await JSON.findById(jobId, '-__v');
        if(!job) return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ job });
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
    const jobId = req.body.jobId;
    try {
        await Job.findByIdAndDelete(jobId, (err, job) => {
            if (err) throw err;
            if (!job) return res.status(404).json({ message: "Job not found" });
            const recruiterId = job.recruiterId;
            Recruiter.findByIdAndUpdate(recruiterId, {
                $pull: { jobs: jobId }
            });
        });
        return res.status(200).json({ message: "Job deleted successfully" });
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