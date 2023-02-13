const express = require('express')
const {registerUser, loginUser, logOutUser, updateProfile, getUser, skillsUpdater, projectsUpdater, socialMediaHandlesUpdater, applyJobForUser, getProjectsOfUser, postProjectsOfUser, verifyEmail} = require('../controllers/userControllers')
const router = express.Router()
const {authenticateToken} = require('../middleware/auth')

// create and save a new user
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// get information
router.get("/getInfo", authenticateToken, getUser);

// update a user by the id in the request
router.patch("/updateProfile", authenticateToken, updateProfile);

// router.put("/skillsUpdate", auth ,skillsUpdater);
// router.put("/projectsUpdate", auth ,projectsUpdater);   //Will have to work on this
// router.put("/socialMediaHandlesUpdate", auth ,socialMediaHandlesUpdater);
// router.get('/apply', applyJobForUser);

// router.get("/projectsGetterofUser", getProjectsOfUser);
// router.post("/projectSetterofUser", postProjectsOfUser);
// router.post("/recruiter/regisrter", registerRecruiter);
// router.post("/recruiter/login", loginRecruiter);
// router.post("/recruiter/info", newRe)

// logout
router.get("/logout", logOutUser);

module.exports = router;
