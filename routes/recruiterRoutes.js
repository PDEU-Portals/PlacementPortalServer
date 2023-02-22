const express = require("express");
const router = express.Router();

const {loginRecruiter, logOutRecruiter, getRecruiter, createJob, getJobs, getJob, addSelectedApplicant, deleteJob, modifyJob, removeSelectedApplicant} = require("../controllers/recruiterControllers");

const {recruiterCheck} = require("../middleware/recruiterCheck");

router.post("/login", loginRecruiter);

router.use(recruiterCheck);

router.get("/logout", logOutRecruiter);
router.get("/", getRecruiter);
router.get("/getJobs", getJobs);
router.get("/getJob", getJob);

router.post("/createJob", createJob);

router.patch("/addSelectedApplicant", addSelectedApplicant);
router.patch("/removeSelectedApplicant", removeSelectedApplicant);
router.patch("/modifyJob", modifyJob);

router.delete("/deleteJob", deleteJob);

module.exports = router;