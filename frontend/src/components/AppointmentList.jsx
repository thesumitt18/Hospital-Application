import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  DialogContentText,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import http from './axiosInstance';
import generateMeetingLink from "../utils/ZoomLinkGenerator"
import { useNavigate } from 'react-router-dom';


const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAcceptPopup, setOpenAcceptPopup] = useState(false);
  const [link, setLink] = useState('');
  const [appointmentId, setAppointmentId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const doctorId = localStorage.getItem('id');
      const response = await http.get(`/consultations/doctor/${doctorId}`);
      
      if (!response || !response.consultations) {
        console.error('API response does not contain consultations:', response);
        setError('No appointments available.');
        setLoading(false);
        return;
      }
      setAppointments(response.consultations); 
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err); 
      setError('No appointments available.');
      setLoading(false);
    }
  };

  // Show loading spinner if data is being fetched
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if fetching fails
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  const handleAccept = async () => {
    try {
      console.log('Accepting appointment with ID:', appointmentId); // Debugging appointmentId
      const response = await http.patch(`/consultations/status/${appointmentId}`, {
        status: 'confirmed',
        meetingLink: link,
      });

      if (response) {
        console.error('Failed to accept consultation. Status:', response.status);
        
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: 'confirmed', meetingLink: link }
              : appointment
          )
        );
        setOpenAcceptPopup(false);
        fetchAppointments();
        console.log('Successfully accepted consultation');
        return;
      }

    } catch (err) {
      console.error('Error while accepting consultation:', err); // Debugging API error
    }
  };

  const handleReject = async (appointmentId) => {
    if (window.confirm('Are you sure you want to reject this consultation?')) {
      try {
        console.log('Rejecting appointment with ID:', appointmentId); // Debugging appointmentId
        const response = await http.patch(`/consultations/status/${appointmentId}`, {
          status: 'rejected',
        });
        // console.log('Reject response:', response); // Debugging API response

        if (response) {
          // console.error('Failed to reject consultation. Status:', response.status);
          // Update state for rejected appointment
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === appointmentId
                ? { ...appointment, status: 'rejected' }
                : appointment
            )
          );
          fetchAppointments();
          console.log('Successfully rejected consultation');
          return;
        }

      } catch (err) {
        console.error('Error while rejecting consultation:', err); 
      }
    }
  };

  // If no appointments are available
  if (appointments.length === 0) {
    console.log('No appointments found.'); 
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="textSecondary">No appointments available.</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center" style={{ marginTop: '20px', fontWeight: 'bold', color: '#3f51b5'} }>Appointments</Typography>
      <Box>
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            style={{
              width: '90vw',
              backgroundColor: '#f9f9f9',
              border: '2px solid #ddd',
              margin: '10px 60px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
            }}
          >
            <CardContent
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {appointment.imagePath && (
                <Box
                  component="img"
                  src={`http://localhost:8989/${appointment.imagePaths}`}
                  alt="Patient"
                  style={{
                    width: '20vw',
                    height: '30vh',
                    borderRadius: 8,
                    marginRight: '10px',
                  }}
                />
              )}

              <Box
                style={{
                  flexGrow: 1,
                  paddingLeft: '10px',
                }}
              >
                <Typography variant="h5" gutterBottom color="black">
                 <strong> Appointment with {appointment.Patient.name} </strong> 
                </Typography>
                <Typography variant="body1" color="black" gutterBottom>
                  Patient ID: {appointment.patientId}
                </Typography>
                <Typography variant="body1" color="black">
                  Date & Time: {new Date(appointment.dateTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="black" paragraph>
                  <strong>Description: </strong>{appointment.description}
                </Typography>
                <Typography
                  variant="body2"
                  color={appointment.status === 'Confirmed' ? 'green' : 'red'}
                  sx={{ marginBottom: '10px' }}
                >
                  <strong>Status: </strong>{appointment.status}
                </Typography>

                {appointment.status === 'Confirmed' && (<>
                Meeting Link: <a href={appointment.meetingLink} target='blank'> {appointment.meetingLink}</a></>
                )}

                <Box
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                  {appointment.status === 'Pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpenAcceptPopup(true);
                          setAppointmentId(appointment.id);
                          setLink(generateMeetingLink());
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          handleReject(appointment.id);
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {appointment.status === 'Confirmed' && (
                    <>
                      <Button variant="contained" disabled>
                        Completed
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          navigate(`/chat/doctor/${appointment.patientId}${appointment.doctorId}`);
                        }}
                      >
                        Chat
                      </Button>
                    </>
                  )}
                  {appointment.status === 'Rejected' && (
                    <Button variant="contained" disabled>
                      Rejected
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Dialog open={openAcceptPopup} onClose={() => setOpenAcceptPopup(false)}>
        <DialogTitle>Appointment Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the Zoom/Skype meeting link :
          </DialogContentText>
          <TextField
            autoFocusvalue
            margin="dense"
            id="link"
            label="Link"
            type="text"
            fullWidth
            variant="standard"
            value={link}
            disabled

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAcceptPopup(false)}>Cancel</Button>
          <Button onClick={() =>handleAccept()}>
            Send Link
          </Button>
        </DialogActions>
        
      </Dialog>
    </div>
  );
};

export default AppointmentList;
