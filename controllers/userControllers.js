const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const sendToken = require('../utils/jwtToken');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const {name, email, password} = req.body

    if(email.split("@")[1] == "sot.pdpu.ac.in"){
        const user = await User.create({
            name,
            email,
            password
        })
        sendToken(user, 201, res);
    }
    else{
        return next(new ErrorHandler('Please enter PDEU email', 400))
    }
}
)
// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const {email, password} = req.body

    //checking if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    sendToken(user, 200, res);
});

//Update skills of user =>  /api/v1/skillsUpdate
exports.skillsUpdater = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const skills = req.body.skills;

    if (!skills)
    {
        return next(new ErrorHandler(`Please enter skills!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email, password: req.body.password})
    sendToken(userAction, 200, res);
});

//update projects of user => /api/v1/projectsUpdate
exports.projectsUpdater = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const projects = req.body.projects;

    if (!projects)
    {
        return next(new ErrorHandler(`Please enter skills!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email, password: req.body.password})
    sendToken(userAction, 200, res);
});

//Update socialMediaHandles of user  =>     /api/v1/socialMediaHandlesUpdate
exports.socialMediaHandlesUpdater = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const socialMediaHandles = req.body.socialMediaHandles;

    if (!socialMediaHandles){
        return next(new ErrorHandler(`Please enter skills!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email, password: req.body.password})
    sendToken(userAction, 200, res);    
})