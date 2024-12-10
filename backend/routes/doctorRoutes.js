const express = require('express');
// const upload = require('../middleware/multer');
const { registerDoctor, loginDoctor,getAllDoctors } = require('../controller/doctorController');
const { verifyEmail }  = require('../controller/emailVerification');

const   router = express.Router();

router.post('/register', registerDoctor);
router.post('/verify-email',verifyEmail);
router.post('/login', loginDoctor);
router.get('/getAllDoctors', getAllDoctors); 

module.exports = router;
