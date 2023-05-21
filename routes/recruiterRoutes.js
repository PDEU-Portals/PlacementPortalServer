const express = require("express");
const cors = require('cors')
const router = express.Router();

const {loginRecruiter, logOutRecruiter, getRecruiter, createJob, getJobs, getJob, addSelectedApplicant, deleteJob, modifyJob, removeSelectedApplicant, addDetails, getDetails,getAllApplicants,removeApplicant,getSelectedApplicants} = require("../controllers/recruiterControllers");

const {recruiterCheck} = require("../middleware/recruiterCheck");

router.post("/login", loginRecruiter);
// router.options("/addDetails", cors())
router.post("/addDetails",addDetails)
router.get("/getDetails/:id", getDetails)

// router.use(recruiterCheck);

router.get("/logout", logOutRecruiter);
router.get("/", getRecruiter);
router.get("/getJobs", getJobs);
router.get("/getJob/:id", getJob);

router.post("/createJob", createJob);

router.get('/applicants/:id',getAllApplicants)

router.post("/addSelectedApplicant", addSelectedApplicant);
router.post("/removeSelectedApplicant", removeSelectedApplicant);
router.post("/removeApplicant",removeApplicant);
router.get("/getSelectedApplicants/:id",getSelectedApplicants)
router.post("/modifyJob", modifyJob);

router.post("/deleteJob/:jobId", deleteJob);

module.exports = router;