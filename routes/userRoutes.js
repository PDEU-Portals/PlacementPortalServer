const express = require('express')
const {registerUser, loginUser, skillsUpdater, projectsUpdater} = require('../controllers/userControllers')
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/skillsUpdate", skillsUpdater)
router.put("/projectsUpdate", projectsUpdater)
module.exports = router
