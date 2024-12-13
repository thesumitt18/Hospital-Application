const Consultation = require('../models/consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

//create consultations
const createConsultation = async (req, res) => {
  try {
      const { patientId, doctorId, dateTime, description } = req.body;

      
      if(!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
      }
      
      imagesPaths = req.files.map(file => file.path).join(',');
      const consultation = await Consultation.create({
          patientId,
          doctorId,
          dateTime,
          description,
          imagesPaths,
      });

      res.status(200).json({ message: 'New appointment created' , consultation});
  } catch (error) {
    console.log(error);
      res.status(400).json({ error: error.message });
  }
};


// Get consultations by doctor ID
const getConsultationsByDoctorId = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const consultations = await Consultation.findAll({
      where: { doctorId },
      include: [
        {
          model: Patient,
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });

    if (!consultations.length) {
      return res.status(404).json({
        message: `No consultations found for doctorId: ${doctorId}`,
      });
    }
    res.status(200).json({
      message: `Consultations for doctorId: ${doctorId}`,
      consultations,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// Get consultations by patient ID
const getConsultationsByPatientID = async (req, res) => {
    const { patientId } = req.params;
    try {
        const consultations = await Consultation.findAll({
            where: { patientId },
            include: {
                model: Doctor,
                attributes: ['id', 'name', 'email', 'specialization']
            },
        });
        if (!consultations.length) {
            return res.status(404).json({ message: 'No appointments available for this patient.' });
        }

        res.status(200).json({ message: 'Currently available appointments:',consultations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update consultation
const updateConsultationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, meetingLink } = req.body;

  try {
    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      res.status(404).json({ message: 'Consultation not found' });
      return;
    }

    if (consultation.status === 'Pending') {
      await consultation.update({ status });
      await consultation.update({ meetingLink });
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(400).json({ message: 'Cannot update status. Consultation is not in pending state.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
}};

module.exports = {
    createConsultation,
    getConsultationsByPatientID,
    updateConsultationStatus,
    getConsultationsByDoctorId
};
