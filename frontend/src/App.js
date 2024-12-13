import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import { Box } from '@mui/material'; 
import DoctorsList from './components/DoctorList';
import ConsultationStatus from './components/ConsultationStatus';
import VerifyEmail from './components/VerifyEmail.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import AppointmentList from './components/AppointmentList.jsx';
import Chat from './components/Chat/chat.js';

const App = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex="1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/consultation-status" element={<ConsultationStatus />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/Doctor-Dashboard" element={<DoctorDashboard />} />
            <Route path="/AppointmentList" element={<AppointmentList />} />
            <Route path='/chat/:detail/:roomId' element={<Chat />} />
            <Route path="/DoctorList" element={isLoggedIn ? <DoctorsList /> : <Navigate to="/login" />}
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
