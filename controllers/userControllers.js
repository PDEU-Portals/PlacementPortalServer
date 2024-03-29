const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validEmailRegex = /^[^@.+_-]+\.[^@.+_-]+@sot\.pdpu\.ac\.in$/;

//Register a user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    if (!validEmailRegex.test(email)) {
        // email should be of format name.xabcyy@sot.pdpu.ac.in  .=4, @=1, _=0, +=0, -=0, space=0
        return res.status(400).json({ message: "Please enter a valid email" });
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({ message: "User already exists! Please proceed to login" })
    }
    const username = email.split("@")[0].split(".").join("-");
    const encPass = await bcrypt.hash(password, 10);
    User.create({
        name,
        email,
        username,
        password: encPass
    }, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Something went wrong" });
        }
        return res.sendStatus(200);
    });
}

//Login a user;  see if first get request can come
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Email or Password Incorrect" });
    }
    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        signed: true,
    });
    return res.sendStatus(200);
}

//Logout a user
exports.logOutUser = async (req, res) => {
    if (req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
}

// Get user details
exports.getUser = async (req, res) => {
    const id = req.body.id;
    User.findById(id, '-_id -password -__v', (err, user) => {   // remove password and _id from response
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    });
}

// Update user details
exports.updateProfile = async (req, res) => {
    const id = req.body.id;
    const { rollNo, dateOfBirth, skills, projects, SGPA, workExperience, publications, phoneNumber, socialMediaHandles } = req.body;
    let myObj = {};
    if (rollNo) myObj.rollNo = rollNo;
    if (dateOfBirth) myObj.dateOfBirth = dateOfBirth;
    if (skills) myObj.skills = skills;
    if (projects) myObj.projects = projects;
    if (SGPA && SGPA.length) myObj.SGPA = SGPA;
    if (workExperience && workExperience.length) myObj.workExperience = workExperience;
    if (publications && publications.length) myObj.publications = publications;
    if (phoneNumber) myObj.phoneNumber = phoneNumber;
    if (socialMediaHandles && socialMediaHandles.length) myObj.socialMediaHandles = socialMediaHandles;
    User.findByIdAndUpdate(id, myObj, {
        new: true,
        select: '-_id -password'
    }, (err, user) => {
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!user) return res.status(404).json({ message: "User not found" });
        /*
        remove unnecessary fields;              Will need to think on this by having conversation with frontend team
        user = JSON.parse(JSON.stringify(user));
        Object.keys(user).forEach(key => {
            if (Array.isArray(user[key]) && user[key].length === 0) delete user[key];
            if (user[key] === undefined) delete user[key];
        });
        */
        return res.status(200).json(user);
    }
    );
}

exports.getJobs = async (req, res) => {
    const id = req.body.id;
    let appliedJobs = await User.findById(id, "appliedJobs");
    if (!appliedJobs) appliedJobs = [];
    const jobs = await Job.find({
         _id: { $nin: appliedJobs } 
        }, "-_id -__v -recruiterId -applicants -approved -selectedApplicants", { 
            sort: { 
                acceptingResponses: -1, 
                jobCreationDate: 1 
            }
        });
    return res.status(200).json(jobs);
}

exports.applyJob = async (req, res) => {
    const id = req.body.id;
    const jobId = req.body.jobId;
    const job = Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!job.acceptingResponses) return res.status(400).json({ message: "Deadline has passed" });
    const user = User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const appliedJobs = user.appliedJobs;
    if (appliedJobs.includes(jobId)) return res.status(409).json({ message: "You have already applied for this job" });
    appliedJobs.push(jobId);
    User.findByIdAndUpdate(id, { appliedJobs }, {
        new: true,
        select: '-_id -password'
    }, (err, user) => {
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!user) return res.status(404).json({ message: "User not found" });
        const applicants = job.applicants;
        applicants.push(id);
        Job.findByIdAndUpdate(jobId, { applicants }, {
            new: true,
            select: '-_id -__v'
        }, (err, job) => {
            if (err) return res.status(400).json({ message: "Something went wrong" });
            if (!job) return res.status(404).json({ message: "Job not found" });
            return res.status(200).json({ msg: "Applied for job successfully" });
        });
    });
}

exports.getAppliedJobs = async (req, res) => {
    const id = req.body.id;
    const appliedJobs = await User.findById(id, "appliedJobs");
    if (!appliedJobs) return res.status(404).json({ message: "User not found" });
    const jobs = await Job.find({ _id: { $in: appliedJobs } }, "-_id -__v");
    return res.status(200).json(jobs);
}

exports.withdrawJobApplication = async (req, res) => {
    const id = req.body.id;
    const jobId = req.body.jobId;
    const user = User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const appliedJobs = user.appliedJobs;
    if (!appliedJobs.includes(jobId)) return res.status(409).json({ message: "You have not applied for this job" });
    appliedJobs.splice(appliedJobs.indexOf(jobId), 1);
    const job = Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const applicants = job.applicants;
    if(!job.acceptingResponses) return res.status(400).json({ message: "Deadline has passed" });
    if (!applicants.includes(id)) return res.status(409).json({ message: "You have not applied for this job" });
    const updatedAppliedJobs = user.appliedJobs.filter(job => job !== jobId);
    User.findByIdAndUpdate(id, { updatedAppliedJobs }, {
        new: true,
        select: '-_id -password'
    }, (err, user) => {
        if (err) return res.status(400).json({ message: "Something went wrong" });
        if (!user) return res.status(404).json({ message: "User not found" });
        Job.findByIdAndUpdate(jobId, { applicants: applicants.filter(applicant => applicant !== id) }, {
            new: true,
            select: '-_id -__v'
        }, (err, job) => {
            if (err) return res.status(400).json({ message: "Something went wrong" });
            if (!job) return res.status(404).json({ message: "Job not found" });
            return res.status(200).json({ msg: "Withdrawn application successfully" });
        });
    });
}