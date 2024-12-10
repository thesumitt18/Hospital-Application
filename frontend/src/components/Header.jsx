import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, [navigate,location]);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Website
        </Typography>

        {isLoggedIn && <h4 style={{ textDecoration: 'none', margin: '0 20% 0', fontSize: '26px' }}>
          Welcome {localStorage.getItem('name')}
        </h4>}
        <nav>
          <Link to="/" style={{ textDecoration: 'none', color: 'white', margin: '0 10px' }}>
            Home
          </Link>
          <Link to="/DoctorList" style={{ textDecoration: 'none', color: 'white', margin: '0 10px' }}>
            Doctors
          </Link>
        </nav>

        {/* Conditional rendering for role-based navigation */}
        {isLoggedIn ? (
          <>
            {role === 'doctor' ? (
              <Link to="/AppointmentList" style={{ textDecoration: 'none', color: 'white', margin: '0 10px' }}>
                Appointments
              </Link>
            ) : (
              <Link to="/consultation-status" style={{ textDecoration: 'none', color: 'white', margin: '0 10px' }}>
                Consultation Status
              </Link>
            )}

            <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" color="inherit" component={Link} to="/login" sx={{ marginLeft: 2 }}>
              Login
            </Button>
            <Button variant="outlined" color="inherit" component={Link} to="/register" sx={{ marginLeft: 2 }}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;


