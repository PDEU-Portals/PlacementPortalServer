const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");


exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const recruiter = Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isMatch = bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SUPERADMIN_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24,
            signed: true,
        });
        return res.status(200).json({ message: "Login Successful" });
    }catch(err){
        return res.status(500).json({message: "Something went wrong"});
    }
}

exports.logOutRecruiter = async (req, res) => {
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
        const encryptedPass = bcrypt.hash(password, 10);
        await Recruiter.create({
            name,
            email,
            password: encryptedPass
        });
        return res.sendStatus(200);
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
        const jobs = await Job.find({});
        if(!jobs){
            return res.status(404).json({message: "No Jobs Found"});
        }
        return res.status(200).json({jobs});
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.getAllUsers = async (req,res)=>{
    try{
        const users = await User.find({});
        if(!users){
            return res.status(404).json({message: "No Users Found"});
        }
        return res.status(200).json({users});
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