const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig');

const Availability = sequelize.define('Availability', {
    doctorId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Doctors',
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

module.exports = Availability;
