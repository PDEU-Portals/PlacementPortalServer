const express = require('express')
const {registerUser, loginUser, skillsUpdater, projectsUpdater, socialMediaHandlesUpdater} = require('../controllers/userControllers')
const {auth} = require("../middlewares/auth")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/skillsUpdate", auth ,skillsUpdater)
router.put("/projectsUpdate", auth ,projectsUpdater)
router.put("/socialMediaHandlesUpdate", auth ,socialMediaHandlesUpdater)

module.exports = router
