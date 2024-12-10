const express = require('express');
const { createConsultation, getConsultationsByPatientID, updateConsultationStatus, getConsultationsByDoctorId } = require('../controller/consultationController');
const authMiddleware = require('../middleware/authMiddleware');
const setupMulter = require('../middleware/multer');
const fileUpload = setupMulter('uploads/multiple/', 'images', true, 10);

const router = express.Router();

// Request consultation
router.post('/create', authMiddleware, fileUpload, createConsultation);

// Get consultations
router.get('/patient/:patientId', authMiddleware, getConsultationsByPatientID);
router.get('/doctor/:doctorId', authMiddleware, getConsultationsByDoctorId);
router.patch('/status/:id', authMiddleware, updateConsultationStatus);

module.exports = router;

