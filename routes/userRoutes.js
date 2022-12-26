const express = require('express')
const {registerUser, loginUser, skillsUpdater} = require('../controllers/userControllers')
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/skillsUpdate", skillsUpdater)
module.exports = router
