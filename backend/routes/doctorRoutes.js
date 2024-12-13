const express = require('express');
// const upload = require('../middleware/multer');
const { registerDoctor, loginDoctor,getAllDoctors, getDoctorDetail } = require('../controller/doctorController');
const { verifyEmail }  = require('../controller/emailVerification');

const   router = express.Router();

router.post('/register', registerDoctor);
router.post('/verify-email',verifyEmail);
router.post('/login', loginDoctor);
router.get('/getAllDoctors', getAllDoctors); 
router.get('/:id',getDoctorDetail)

module.exports = router;
