const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
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
exports.skillsUpdater = catchAsyncErrors(async (req, res, next) => {
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
exports.projectsUpdater = catchAsyncErrors(async (req, res, next) => {
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
exports.socialMediaHandlesUpdater = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)//for testing
    const socialMediaHandles = req.body.socialMediaHandles;
    if (!socialMediaHandles){
        return next(new ErrorHandler(`Please enter social media handles!`, 400))
    }

    const userAction = await User.findOneAndUpdate({email: req.body.email}, {socialMediaHandles: socialMediaHandles})
    res.status(200).send(userAction)    
})