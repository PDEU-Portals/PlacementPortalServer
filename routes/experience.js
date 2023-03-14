const express = require('express')
const router = express.Router()
const {addExperience, getExperiences} = require('../controllers/experienceController')

router.route("/exp")
    .get(getExperiences)
    .post(addExperience)

module.exports = router