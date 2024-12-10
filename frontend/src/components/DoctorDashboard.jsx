

import  React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const DoctorDashboard = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Welcome Section */}
      <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, Dr. [Your Name]!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Here's an overview of your dashboard.
        </Typography>
      </Paper>

      {/* Dashboard Sections */}
      <Grid container spacing={3}>
        {/* Appointments Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You have 5 appointments scheduled for today.
            </Typography>
          </Paper>
        </Grid>

        {/* Patient Records Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Records
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Access patient history, test results, and more.
            </Typography>
          </Paper>
        </Grid>

        {/* Notifications Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You have 3 new messages and 2 lab results to review.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;
