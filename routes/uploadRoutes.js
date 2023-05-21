const express = require('express')
const {uploadResume,uploadCv,uploadProfilePhoto} = require('../controllers/uploadControllers')
const router = express.Router()

router.post("/resume/:id",uploadResume)
router.post("/cv/:id",uploadCv)
router.post("/profile/:id",uploadProfilePhoto)

module.exports = router