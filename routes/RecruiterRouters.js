const express = require('express')
const {NewRecruiter, getRecruiterid, getRecruiter} = require('../controllers/RecruiterController')
const {auth} = require("../middlewares/auth")
const router = express.Router()

router.post("/recruiter/regisrter", registerRecruiter);
router.post("/recruiter/login", loginRecruiter);
router.post("/recruiter/info", NewRecruiter);
router.get('recruiter/getinfo', getRecruiter);