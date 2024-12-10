const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig');
const Patient =  require('../models/Patient')
const Doctor =  require('../models/Doctor')

const Consultation = sequelize.define('Consultation', {
    patientId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Patients',
            key: 'id',
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Doctors',
            key: 'id',
        },
    },
    dateTime: {
        type:DataTypes.DATE,
        allowNull:false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Rejected'),
        defaultValue: 'Pending',
    },
    imagesPaths: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull:true
    }
},{
    sequelize,
    timestamps: true,  // Optionally, if you want to track createdAt and updatedAt
    createdAt: 'createdAt', // Optional, explicitly define the timestamp field
    updatedAt: 'updatedAt', // Optional, explicitly define the timestamp field
});

Consultation.belongsTo(Patient, {foreignKey:'patientId'});
Consultation.belongsTo(Doctor, {foreignKey:'doctorId'} );


module.exports = Consultation;

