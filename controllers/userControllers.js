const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {User, Recruiter, JobPosting } = require('../models/user');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcryptjs')

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    if(email.split("@")[1] == "sot.pdpu.ac.in"){

        const existingUser = await User.findOne({email})

        if(existingUser){
            res.status(401).send("User already exists! Please proceed to login")
        }

        const encPass = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: encPass
        })    
        
        const token = jwt.sign(
            {user_id: user._id, email},
            SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )

        user.token = token

        user.password = undefined

        res.status(201).json(user)
    }
    else{
        return next(new ErrorHandler('Please enter PDEU email', 400))
    }
}
)
// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checking if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    // const isPasswordMatched = await user.comparePassword(password);
    // if (!isPasswordMatched) {
    //     return next(new ErrorHandler('Invalid Email or Password', 401))
    // }
    // sendToken(user, 200, res);
    if(user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )

        user.token = token
        user.password = undefined

        res.status(200).json(user)
    }
    res.status(400).send("Email or password is incorrect")

});

//Update skills of user =>  /api/v1/skillsUpdate
exports.skillsUpdater = catchAsyncErrors(async(req, res, next) => {
    //console.log(req)//for testing
    const skills = req.body.skills;
    console.log(skills)
    if (!skills)
    {
        return next(new ErrorHandler(`Please enter skills!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email}, {skills: skills})
    res.status(200).send(userAction)
});

//update projects of user => /api/v1/projectsUpdate
exports.projectsUpdater = catchAsyncErrors(async(req, res, next) => {
    //console.log(req)//for testing
    const projects = req.body.projects;
    if (!projects)
    {
        return next(new ErrorHandler(`Please enter projects!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email}, {projects: projects})
    res.status(200).send(userAction) 
});

//Update socialMediaHandles of user  =>     /api/v1/socialMediaHandlesUpdate
exports.socialMediaHandlesUpdater = catchAsyncErrors(async(req, res, next) => {
    //console.log(req)//for testing
    const socialMediaHandles = req.body.socialMediaHandles;
    if (!socialMediaHandles){
        return next(new ErrorHandler(`Please enter social media handles!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email}, {socialMediaHandles: socialMediaHandles})
    res.status(200).send(userAction)    
})

// const NewRecruiter = async(req, res)=>{
//     const {Company_Name, Description, Website, Jobs_Posted} =req.body;
//     try{
//     const new_Recruiter = await Recruiter.create({Company_Name, Description, Website, Jobs_Posted}, (err, results)=>{
//         res.status(200).json(result);
        

//     })
//     res.status(200).json(new_Recruiter)
//     }
//     catch(err){
//         res.status(401).send({err: "Cannot Register New Recruiter"})
//     }
// }

// const getRecruiterid = (req,res)=>{
//     const {Company_Name} = req.body;
//     try{
//         const recruiter_id = await (Recruiter.findOne({CompanyName : Company_Name}))._id; //Can be used to parse in different queries for fetching apis
//         return recruiter_id;
//     }
//     catch{
//         res.status(401).send({err: err.message});
//     }

// } 

// const getRecruiter = async(req, res)=>{
//     const {Company_Name} = req.body;
//     try{
//         const recruiter = await Recruiter.findOne({CompanyName : Company_Name}, (err, result)=>{
//             res.status(200).json(result);
//         });
//         res.status(200).json(recruiter);
//        return res.status(200).json(recruiter_id);
//     }
//     catch(err){
//         res.status(401).send({err: err.message})
//         // res.status(400).send({err: "Cannot Find the Recruiter"})
//     }
// }

// const newJobPosting = async(req, res)=>{
//     const recruiter_id = getRecruiterid;
//     const {headline, job_type,job_description, Pref_branches, deadline, user_applied, dateOfPosting} = req.body;
//     try{
//         const job_posting = await JobPosting.create({recruiter_id, headline, job_type, job_description, Pref_branches, deadline, dateOfPosting, user_applied}, (err, result)=>{
//             res.status(200).send("Job Posted");
//             res.status(200).json(result);
//         });
//         res.status(200).json(job_posting);

//     }
//     catch(err){
//         res.status(400).json({err: err.message});
//     }
// }

// //Getting Job id
// const job_id = (req,res)=>{
//     try{
//     const job_id = await (JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}))._id; //Can be used to parse in different queries for fetching apis
//     return job_id;
// }
//     catch(err){
//         res.status(400).json({err: err.message});
//     }
// }

// const getJobPosting = async(req, res)=>{
//     const Recruiter_id = getRecruiterid;
//     const { headline, dateOfPosting  } = req.body;
//     try{
//         const job_id = await (JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}))._id; //Can be used to parse in different queries for fetching apis
//         const Job = await JobPosting.findOne({recruiter_id: Recruiter_id, headline: headline, dateOfPosting: dateOfPosting}, (err, result)=>{
//             res.status(200).json(result);
//         });
//         res.status(200).json(Job);
//        return res.status(200).json(job_id);
//     }
//     catch(err){
//         res.status(401).send({err: err.message})
//         // res.status(400).send({err: "Cannot Find the Recruiter"})
//     }
// }

//Getting userId
const getUserId = (req, res) => {
    const {name, email} = req.body;

    let user_id = User.findOne({name: name, email: email})._id;
    return user_id;
}

//Apply for Job From Users end
const applyJobForUser = async(req, res) => {
    const Recruiter_id = getRecruiterid;
    let Job_id = getJobPosting;
    let user_id = getUserId;
    try{
    const JobApplied = await JobPosting.UpdateMany({recruiter_id: Recruiter_id, job_id: Job_id}, {$push: {users_applied: {user_id: user_id, /*dateofSubmission : */}}}, {approved : false});
    getJobsAppliedForUser;
    res.status(200).send("Job Successfully Applied");
    res.status(200).json(JobApplied);
    }

catch(err){
    res.status(300).send("Error Applying the Job");
}
}

//Updating the User Profile on Getting Applied
const getJobsAppliedForUser = async(req, res)=>{
    const {name, email} = req.body;
    const recruiter_id = getRecruiter;
    let job_id = getJobPosting;
    let user_id = getUserId;
    try{
        let updateUser = await User.UpdateOne({_id: user_id, name: name, email:email}, {$push: {jobs_applied : {recruiter_id: recruiter_id, job_id: job_id,/* date_Of_Submission */}}});
        res.status(200).json(updateUser);   
    }catch(err){
        res.status(400).send({err: err.message});
    }
}

//--> Projects CRUD
// Projects getting 
exports.getProjectsOfUser = async(req, res) => {

}

//Projects updating
exports.postProjectsOfUser = async(req, res) => {

}

module.exports = {getUserId, applyJobForUser, getJobsAppliedForUser};