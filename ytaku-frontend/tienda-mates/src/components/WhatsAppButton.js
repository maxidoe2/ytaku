import React from 'react';
import { IconButton, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000, // Asegura que el botón esté por encima de otros elementos
      }}
    >
      <IconButton
        component="a"
        href="https://wa.me/5493516459522?text=Hola%20Ytaku%20Mates,%20necesito%20más%20información."
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: '#25D366',
          color: '#ffffff',
          width: 60,
          height: 60,
          '&:hover': {
            backgroundColor: '#2ab55e',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Box>
  );
};

export default WhatsAppButton;
