const Recruiter = require('../models/recruiter')
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require('../models/User')

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const admin = await Admin.findOne({email:email})
        if(!admin){
            return res.status(404).send('User not found')
        }
        let isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.status(401).send("Invalid Credentials")
        }

        res.status(200).send("Logged in successful")
    }catch(err){
        return res.status(500).json({message: "Something went wrong",err});
    }
}

exports.logOutAdmin = async (req, res) => {
    if (req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
}

exports.registerRecruiter = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const data = Recruiter.findOne({ email });
        if (data) {
            return res.status(409).json({ message: "User already exists" });
        }
        // const encryptedPass = bcrypt.hash(password, 10);
        const recruiter = await Recruiter.create({
            name,
            email,
            // password: encryptedPass
            password: encryptedPass
        });
        return res.status(200).json(recruiter);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong" });
    }
};

exports.disableRecruiter = async (req,res)=>{
    const id = req.body.id;
    try{
    const recruiter = await Recruiter.findById(id);
    if(!recruiter){
        return res.status(404).json({message: "Recruiter not found"});
    }
    recruiter.isCurrentRecruiter = false;
    await recruiter.save();
    return res.status(200).json({message: "Recruiter stopped from accessing the Portal"});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.enableRecruiter = async (req,res)=>{
    const id = req.body.id;
    try{
        const recruiter = await Recruiter.findById(id);
        if(!recruiter){
            return res.status(404).json({message: "Recruiter not found"});
        }
        recruiter.isCurrentRecruiter = true;
        await recruiter.save();
        return res.status(200).json({message: "Recruiter can now access the Portal"});
    } catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.disableUser = async (req,res)=>{
    const userId = req.body.userId;
    try{
        const student = await User.findById(userId);
        if(!student){
            return res.status(404).json({message: "User not found"});
        }
        student.accountAccess = false;
        await student.save();
        return res.status(200).json({message: `User ${student.rollNo} stopped from accessing the Portal`});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.enableUser = async (req,res)=>{
    const userId = req.body.userId;
    try{
        const student = await User.findById(userId);
        if(!student){
            return res.status(404).json({message: "User not found"});
        }
        student.accountAccess = true;
        await student.save();
        return res.status(200).json({message: `User ${student.rollNo} can now access the Portal`});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.getAllJobs = async (req,res)=>{
    try{
        const jobs = await Job.find({}, {}, {sort: {jobCreationDate: -1}});
        if(!jobs){
            return res.status(404).json({message: "No Jobs Found"});
        }
        return res.status(200).json({jobs});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.getJobsByYear = async (req, res)=>{
    try{
        const jobCreationDate = req.body.jobCreationDate;
        if(!jobCreationDate) return res.status(404).json({msg: "Jobs not Found for the current Date"});
        const year = jobCreationDate.getFullYear();
        Job.aggregate([
            {
              $match: {
                $expr: {
                  $eq: [{ $year: "$dateField" }, year]
                }
              }
            }
          ])
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.getAllUsers = async (req,res)=>{
    try{
        const users = await User.find({});
        if(!users){
            return res.status(404).json({message: "No Users Found"});
        }
        return res.status(200).json(users);
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.getAllRecruiters = async (req,res)=>{
    try{
        const recruiters = await Recruiter.find({});
        if(!recruiters){
            return res.status(404).json({message: "No Recruiters Found"});
        }
        return res.status(200).json({recruiters});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.listJobOfRecruiter = async (req,res)=>{
    const recruiterId = req.body.recruiterId;
    try{
        const recruiter = await Recruiter.findById(recruiterId);
        if(!recruiter){
            return res.status(404).json({message: "Recruiter not found"});
        }
        const jobs = await Job.find({recruiterId: recruiter._id});
        if(!jobs){
            return res.status(404).json({message: "No Jobs Found"});
        }
        return res.status(200).json({jobs});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.deleteJob = async (req,res)=>{
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

exports.approveJob = async (req,res)=>{
    const jobId = req.body.jobId;
    try{
        const job = Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        job.isApproved = true;
        await job.save();
        return res.status(200).json({message: "Job Approved"});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.rejectJob = async (req,res)=>{
    const jobId = req.body.jobId;
    try{
        const job = Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        job.isApproved = true;
        await job.save();
        return res.status(200).json({message: "Job Rejected"});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}