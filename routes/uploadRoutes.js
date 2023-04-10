const express = require('express')
const {uploadResume} = require('../controllers/uploadControllers')
const router = express.Router()

router.post("/resume",uploadResume)

module.exports = router