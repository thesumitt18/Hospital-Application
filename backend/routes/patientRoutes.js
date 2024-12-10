const express = require('express');
const { registerPatient, loginPatient } = require('../controller/patientController');
const { verifyEmail }  = require('../controller/emailVerification');
const router = express.Router();


router.post('/register', registerPatient);
router.post('/verify-email',verifyEmail);
router.post('/login', loginPatient);

module.exports = router;
