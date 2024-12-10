const Sequelize = require('sequelize');
const Patient = require('../models/Patient'); 
const Doctor= require('../models/Doctor'); 

const emailVerification = async (token, role) => {
    let model;

    // Determine the model based on userType
    if (role === 'patient') {
        model = Patient;
    } else if (role === 'doctor') {
        model = Doctor;
    } else {
        throw new Error('Invalid user type.');
    }
    
    const user = await model.findOne({
        where: {
            verificationToken: token,
            verificationExpires: { [Sequelize.Op.gt]: Date.now() }, 
        },
    });

    if (!user) {
        throw new Error('Invalid or expired token.');
    }    
    
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await user.save();

    return user; 
};

module.exports = { emailVerification };
