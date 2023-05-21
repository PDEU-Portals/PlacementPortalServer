const express = require('express')
const {uploadResume,uploadCv} = require('../controllers/uploadControllers')
const router = express.Router()

router.post("/resume/:id",uploadResume)
router.post("/cv/:id",uploadCv)

module.exports = router