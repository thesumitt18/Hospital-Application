import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import http from './axiosInstance';
import { useNavigate } from 'react-router-dom';


const ConsultationsStatus = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await http.get(`consultations/patient/${localStorage.getItem('id')}`);
      const consultations = [...response.consultations].map((consultation) => ({
        ...consultation,
        imagesPaths: consultation.imagesPaths ? consultation.imagesPaths.split(',') : [],
      }))
      setConsultations(consultations);
      setLoading(false);
    } catch (err) {
      setError('Error fetching consultations. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">Consultations</Typography>
      <Box>
        {consultations.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">No consultations available.</Typography>
        ) : (
          consultations.map((consultation) => (
            <Card
              key={consultation.id}
              style={{
                width: '95vw',
                backgroundColor: 'lightgrey',
                border: '1px solid darkgrey',
                margin: '5px 20px 15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
              }}
            >
              <CardContent
                style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  margin: '10px 30px', 
                }}
              >

                {/* //do this  */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100px',
                    height: '100px',
                    border: '1px solid lightgrey',
                    borderRadius: '10px',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpen(true)}
                >
                  <Typography variant="h6">View Images</Typography>
                </Box>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                >
                  <DialogTitle>Consultation Images</DialogTitle>
                  <DialogContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      {consultation.imagesPaths.map((imagePath, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={`http://localhost:8989/${imagePath}`}
                          alt="Consultation"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: 8,
                            marginRight: '10px',
                          }}
                        />
                      ))}
                    </Box>
                  </DialogContent>
                </Dialog> 

                {/* Right side (text content, 80% of width) */}
                <Box
                  style={{
                    flexGrow: 1,
                    paddingLeft: '10px',
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Consultation with {consultation.Doctor.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Patient ID: {consultation.patientId}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Date & Time: {new Date(consultation.dateTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Description: </strong>{consultation.description}
                  </Typography>
                  {consultation.status === 'Confirmed' && (
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1" color="textSecondary" paragraph>
                        <strong>Meeting Link: </strong>
                        <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer">
                          {consultation.meetingLink}
                        </a>
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/chat/patient/${consultation.patientId}${consultation.doctorId}`)} 
                        style={{width: '100px', marginBottom: '10px'}}                    
                      >
                        Chat
                      </Button>
                    </Box>
                  )}
                  <Typography variant="body1" color="textSecondary">
                    Status: {consultation.status}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </div>
  );
};

export default ConsultationsStatus;

