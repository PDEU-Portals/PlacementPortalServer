const express = require('express')
const router = express.Router()
const {addExperience, getExperience} = require('../controllers/experienceController')

router.post("/addexp/:id", addExperience)
router.get("/exp", getExperience)

module.exports = router