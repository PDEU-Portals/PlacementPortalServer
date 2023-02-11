const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth');
const { getProfile } = require('../controllers/openControllers');

router.get("/:username", authenticateToken, getProfile);

module.exports = router;