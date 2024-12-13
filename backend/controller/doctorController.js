const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const sendMail = require('../utils/nodemailer');
const { get } = require('http');

const registerDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    try {
        const existingDoctor = await Doctor.findOne({ where: { email } });
        if (existingDoctor) {
            return res.status(409).json({ message: `Doctor already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = await Doctor.create({
            name,
            email,
            password: hashedPassword,
            specialization,
        });

        const payload = { id: newDoctor.id, role: 'doctor' };
        const verificationToken = jwt.sign(payload, 'sumit', { expiresIn: '1h' });

        // Generate a verification link
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}&code=201`;

        // Send the verification email
        const doctorEmail = newDoctor.email;
        const doctorName = newDoctor.name;
        await sendMail(doctorEmail, "Email Verification", `
            <h1>Welcome ${doctorName}</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
        `);

        // Update Doctor with the verification token and expiration
        await Doctor.update({
            verificationToken,
            verificationExpires: Date.now() + 3600000, // 1 hour expiry
        }, {
            where: { id: newDoctor.id }
        });

        res.status(201).json({ message: `New doctor added`, newDoctor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a doctor

const loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ where: { email }, raw: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }
        if (!doctor.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }
        const token = jwt.sign({ id: doctor.id }, 'sumit', { expiresIn: '1h' });

        res.status(200).json({
            token,
            role: 'doctor',
            id: doctor.id,
            name: doctor.name,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Fetch all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({ attributes: ['id', 'name', 'specialization', 'email'], raw: true });  // Fetch all doctors from the database
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getDoctorDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  



module.exports = {
    registerDoctor,
    loginDoctor,
    getAllDoctors,
    getDoctorDetail
};
