const express = require('express')
const {registerUser, loginUser, logOutUser, updateProfile, getUser, getJobs, applyJob, getAppliedJobs, withdrawJobApplication} = require('../controllers/userControllers')
const router = express.Router()
const {authenticateToken} = require('../middleware/auth')

// create and save a new user
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// get information
router.get("/getInfo/:id", authenticateToken, getUser);

// update a user by the id in the request
// router.post("/updateProfile", authenticateToken, updateProfile);
router.post("/updateProfile", updateProfile);

// get all jobs
// router.get("/getJobs", authenticateToken, getJobs);
router.get("/getJobs", getJobs);

// apply for a Job
// router.post("/applyJob", authenticateToken, applyJob);
router.post("/applyJob", applyJob);

// get all applied jobs
// router.get("/getAppliedJobs", authenticateToken, getAppliedJobs);
router.get("/getAppliedJobs", getAppliedJobs);

// withdraw job application
router.post("/withdrawJobApplication", authenticateToken, withdrawJobApplication);


// logout
router.get("/logout", logOutUser);

module.exports = router;
