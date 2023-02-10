const express = require('express')
const {registerUser, loginUser, logOutUser, skillsUpdater, projectsUpdater, socialMediaHandlesUpdater, applyJobForUser, getProjectsOfUser, postProjectsOfUser} = require('../controllers/userControllers')
const router = express.Router()
const {authenticateSession, loginAuth} = require('../middleware/auth')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
// router.put("/skillsUpdate", auth ,skillsUpdater);
// router.put("/projectsUpdate", auth ,projectsUpdater);   //Will have to work on this
// router.put("/socialMediaHandlesUpdate", auth ,socialMediaHandlesUpdater);
// router.get('/apply', applyJobForUser);

// router.get("/projectsGetterofUser", getProjectsOfUser);
// router.post("/projectSetterofUser", postProjectsOfUser);
// router.post("/recruiter/regisrter", registerRecruiter);
// router.post("/recruiter/login", loginRecruiter);
// router.post("/recruiter/info", newRe)

module.exports = router;
