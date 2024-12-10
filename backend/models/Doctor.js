const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig');
const bcrypt = require('bcrypt');

const Doctor = sequelize.define('Doctor', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    verificationExpires: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
} ,   {
    sequelize,
    timestamps: false
  },);

module.exports = Doctor;
