const express = require('express');
const router = express.Router();

const {addAdmin, deleteAdmin, getAdmins, registerSuperAdmin} = require('../controllers/superAdminControllers');
const {registerRecruiter, disableRecruiter, enableRecruiter, disableUser, enableUser} = require('../controllers/adminControllers');

router.post('/addAdmin', addAdmin);
router.get('/getAdmins', getAdmins);
router.delete('/deleteAdmin', deleteAdmin);

router.post('/addsuper', registerSuperAdmin)


router.post('/registerRecruiter', registerRecruiter);
router.post('/disableRecruiter', disableRecruiter);
router.post('/enableRecruiter', enableRecruiter);
router.post('/disableUser', disableUser);
router.post('/enableUser', enableUser);

module.exports = router;