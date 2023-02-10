const express = require('express');
const router = express.Router();

const {isLoggedIn} = require("../controllers/internalControllers");

router.get("/isLoggedIn", isLoggedIn);


module.exports = router;