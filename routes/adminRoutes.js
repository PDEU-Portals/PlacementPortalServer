const express =  require('express');
const router = express.Router();

const {registerRecruiter, disableRecruiter, enableRecruiter, disableUser, enableUser, getAllUsers, loginAdmin, logOutAdmin} = require('../controllers/adminControllers');

router.post('/login',loginAdmin)
router.post('/logout',logOutAdmin)
router.post('/registerRecruiter', registerRecruiter);
router.post('/disableRecruiter', disableRecruiter);
router.post('/enableRecruiter', enableRecruiter);
router.post('/disableUser', disableUser);
router.post('/enableUser', enableUser);
router.get('/getUsers', getAllUsers)

module.exports = router;