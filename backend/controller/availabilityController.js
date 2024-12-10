const  Availability  = require('../models/availability');

// Create availability
const createAvailability = async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;
    // console.log('Availability', Availability)
    try {
        const availability = await Availability.create({ doctorId, date, startTime, endTime });
        res.status(201).json({message: `Doctor availability created `,availability});
    } catch (err) {
        // console.log(err);
        res.status(500).json(err);
    }   
};

// Get availability 
const getAvailability = async (req, res) => {
    try {
        const availability = await Availability.findAll();
        res.status(200).json(availability);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Delete availability
const deleteAvailability = async (req, res) => {
    const { id } = req.params;
    try {
        await Availability.destroy({ where: { id } });
        res.status(204).josn({message: `Dr. Availabilty removed.`});
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = {
    createAvailability,
    getAvailability,
    deleteAvailability,
};
