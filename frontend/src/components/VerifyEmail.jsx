import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from './axiosInstance'; 
import { ToastContainer, toast } from 'react-toastify';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');
            const code = queryParams.get('code');
            console.log(code);
            
            if (!token) {
                toast.error('Invalid verification link.');
                setLoading(false);
                return;
            }

            try {
                const userRole = code === 101 ? 'patient' : 'doctor'
                // Call the verification API
                const response = await http.post(`/${userRole}/verify-email?token=${token}`);
                console.log(response);
                if (response.status === 200) {
                    setTimeout(() => {
                        toast.success('Email verified successfully!');
                        navigate('/login'); 
                       }, 1500);
                } else {
                    toast.error('Email verification failed.');
                }
            } catch (error) {
                // console.log(error);
                toast.error(error.response?.data?.message || 'Verification failed.');
                
            } finally {
                setLoading(false);
            }
        };
        verifyEmail();
    }, [location, navigate]);

    return (
        <Container maxWidth="xs" style={{ marginTop: '100px', textAlign: 'center' }}>
            <ToastContainer />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>Verifying your email...</Typography>
                </Box>
            ) : (
                <Typography variant="h5" color="primary">
                    Verification Complete
                </Typography>
            )}
        </Container>
    );
};

export default VerifyEmail;
