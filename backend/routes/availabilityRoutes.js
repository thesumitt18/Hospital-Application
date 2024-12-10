const express = require('express');
const { createAvailability, getAvailability, deleteAvailability } = require('../controller/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create availability
router.post('/create', authMiddleware, createAvailability);

// Get availability 
router.get('/', authMiddleware, getAvailability);

// Delete availability 
router.delete('/:id', authMiddleware, deleteAvailability);

module.exports = router;
