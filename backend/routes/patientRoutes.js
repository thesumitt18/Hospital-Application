const express = require('express');
const { registerPatient, loginPatient, getPatientDetails } = require('../controller/patientController');
const { verifyEmail }  = require('../controller/emailVerification');
const router = express.Router();


router.post('/register', registerPatient);
router.post('/verify-email',verifyEmail);
router.post('/login', loginPatient);
router.get('/:id', getPatientDetails);

module.exports = router;
