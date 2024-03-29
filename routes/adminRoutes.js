const express =  require('express');
const router = express.Router();

const {registerRecruiter, disableRecruiter, enableRecruiter, disableUser, enableUser} = require('../controllers/adminControllers');

router.post('/registerRecruiter', registerRecruiter);
router.post('/disableRecruiter', disableRecruiter);
router.post('/enableRecruiter', enableRecruiter);
router.post('/disableUser', disableUser);
router.post('/enableUser', enableUser);

module.exports = router;