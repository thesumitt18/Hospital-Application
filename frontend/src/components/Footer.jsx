// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#282c34',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        width: '100%',
      }}
    >
      <Container>
        <Typography variant="body2">
          © 2024 Skincare Brand. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
