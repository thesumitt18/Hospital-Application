const { emailVerification } = require('../utils/emailVerification');
const jwt = require('jsonwebtoken');

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, 'sumit');  // This verifies and decodes the token
        const { id, role } = decoded;  // Destructure the necessary values from the decoded token

        // Call the service to verify the email token
        const user = await emailVerification(token, role);

        res.status(200).json({
            status: 200,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} email verified successfully!`,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ status: 400, message: 'Token has expired. Please request a new verification email.' });
        }

        res.status(400).json({ status: 400, message: error.message || 'An error occurred during email verification.' });
    }
};

module.exports = { verifyEmail };

