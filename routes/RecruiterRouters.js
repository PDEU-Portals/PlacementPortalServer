const express = require('express')
const {NewRecruiter, getRecruiterId, getRecruiter} = require('../controllers/RecruiterController')
const {auth} = require("../middlewares/auth")
const router = express.Router()

router.post("register", registerRecruiter);
router.post("/recruiter/login", loginRecruiter);
router.post("/recruiter/info", NewRecruiter);
router.get('recruiter/getInfo', getRecruiter);