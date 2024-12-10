import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [disableButton, setDisableButton] = useState(false); 
  const navigate = useNavigate(); 
  let timeoutID;

  // Define the list of specializations
  const specializations = [
    { value: '', label: 'Select Specialization' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'neurology', label: 'Neurology' },
    // Add more specializations as needed
  ];

  useEffect(()=> {
    return () => {
      clearTimeout(timeoutID);
      // console.log('Timeout cleared');
    };
  }, [timeoutID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableButton(true);

    const toastId1 = toast.loading('Registering, please wait...');
    setTimeout(() => {
      toast.dismiss(toastId1);
    }, 4000);


    const data = {
      role,
      name,
      email,
      password,
      phone,
      specialization: role === 'doctor' ? specialization : undefined,
    };

    const endpoint = role === 'doctor' ? '/doctor/register' : '/patient/register';

    try {
      const response = await http.post(endpoint, data);
      console.log('Registration successful:', response.data);
      toast.success('Registration successful!');
      timeoutID = setTimeout(() => {
        navigate('/login')  
      }, 2000);
           
    } catch (error) {
      const errorMessage = 'Error: ' + (error.message || 'Unknown error');
      toast.error(errorMessage);
      setDisableButton(false);
    }
  };

  return (
    <>
      <Container maxWidth="xs" className="register-container" sx={{ my: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            p: 2,
            backgroundColor: 'white',
            boxShadow: 6,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Register Form
          </Typography>

          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 2, boxShadow: 1 }}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          {role === 'doctor' && (
            <TextField
              fullWidth
              select
              label="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              sx={{ mb: 2, boxShadow: 1 }}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec.value} value={spec.value}>
                  {spec.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button variant="contained" color="primary" type="submit" fullWidth  disabled= {disableButton} >
            Register
          </Button>
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Register;
