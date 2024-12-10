import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import http from './axiosInstance'; 
import { ToastContainer, toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');  
  const navigate = useNavigate(); 
  let timeoutID;

  // Cleanup for timeout ID
  useEffect(() => {

    return () => {
      clearTimeout(timeoutID);
    };
  }, [timeoutID]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };
    const endpoint = role === 'doctor' ? '/doctor/login' : '/patient/login';

    try {
      const response = await http.post(endpoint, data);
      
      if (response) {
        toast.success('Login successful!');
        // Store the token and role in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('id', response.id);
        localStorage.setItem('name', response.name);

        timeoutID = setTimeout(() => {
          if (role === 'doctor') {
            navigate('/');  
          } else {
            navigate('/'); 
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(`Please verify the email`);
    }
  };

  // Gmail login placeholder
  const handleGmailLogin = () => {
    console.log("Logging in with Gmail...");   
  };

  return (
    <>
      <Container maxWidth="xs" className="login-container" sx={{ my: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'white',
            boxShadow: 6,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            Login
          </Typography>

          {/* Role Selection */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Login as:</FormLabel>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="patient" control={<Radio />} label="Patient" />
              <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
            </RadioGroup>
          </FormControl>

          {/* Email input */}
          <TextField
            fullWidth
            label="User Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          {/* Password input */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2, boxShadow: 1 }}
          />

          {/* Login button */}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>

          {/* Forgot password link */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link href="#" onClick={() => alert('Forgot Password link clicked!')            }>
          
              Forgot Password?
            </Link>
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Login with Gmail button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGmailLogin}
            fullWidth
          >
            Login with Gmail
          </Button>
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Login;
