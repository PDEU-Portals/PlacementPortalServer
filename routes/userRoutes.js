const express = require('express')
const {registerUser, loginUser, logOutUser, updateProfile, getUser, getJobs, applyJob, getAppliedJobs, withdrawJobApplication, generate_link} = require('../controllers/userControllers')
const router = express.Router()
const {authenticateToken} = require('../middleware/auth')
const redirectUser = require('../helpers/validsators');

// create and save a new user
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// get information
router.get("/getInfo", authenticateToken, getUser);

// update a user by the id in the request
router.post("/updateProfile", authenticateToken, updateProfile);
// router.post("/updateProfile", updateProfile);

// get all jobs
// router.get("/getJobs", authenticateToken, getJobs);
router.get("/getJobs", getJobs);

// apply for a Job
router.post("/applyJob", authenticateToken, applyJob);

// get all applied jobs
router.get("/getAppliedJobs", authenticateToken, getAppliedJobs);

// withdraw job application
router.post("/withdrawJobApplication", authenticateToken, withdrawJobApplication);

router.post('/verify-email', redirectUser);

router.post('/:user_id/verify-email/generate_link', generate_link);


// logout
router.get("/logout", logOutUser);

module.exports = router;
