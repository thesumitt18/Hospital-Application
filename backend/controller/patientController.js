const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const { Sequelize } = require('sequelize');

// Register a new patient
const registerPatient = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const existingPatient = await Patient.findOne({ where: { email } });
        if (existingPatient) {
            return res.status(409).json({ message: `Patient already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new patient record
        const newPatient = await Patient.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        // verification token with an expiration time
        const payload = { id: newPatient.id, role: 'patient' };
        const verificationToken = jwt.sign(payload, 'sumit', { expiresIn: '1h' });

        // verification link
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}&code=101`;

        // Send the verification email
        const patientEmail = newPatient.email;
        const patientName = newPatient.name;
        await sendMail(patientEmail, "Email Verification", `
            <h1>Welcome ${patientName}</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
        `);

        // Update patient with the verification token and expiration
        await Patient.update({
            verificationToken,
            verificationExpires: Date.now() + 3600000, // 1 hour expiry
        }, {
            where: { id: newPatient.id }
        });

        res.status(201).json({
            message: `New Patient Registered. Please check your email to verify your account.`,
            newPatient,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a patient
const loginPatient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const patient = await Patient.findOne({ where: { email }, raw:true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        if (!patient.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const token = jwt.sign({ id: patient.id }, 'sumit', { expiresIn: '1h' });

        res.status(200).json({
            token,
            role: 'patient',
            id: patient.id,
            name: patient.name,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPatientDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerPatient,
    loginPatient,
    getPatientDetails,
};
