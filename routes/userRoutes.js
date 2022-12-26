const express = require('express')
const {registerUser, loginUser, skillsUpdater, projectsUpdater, socialMediaHandlesUpdater} = require('../controllers/userControllers')
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/skillsUpdate", skillsUpdater)
router.put("/projectsUpdate", projectsUpdater)
router.put("/socialMediaHandlesUpdate", socialMediaHandlesUpdater)

module.exports = router
