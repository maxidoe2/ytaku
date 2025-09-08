// NotFound.js
import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" gutterBottom>
          Artículo no encontrado
        </Typography>
        <Typography variant="body1" gutterBottom>
          Lo sentimos, el artículo que estás buscando no tiene más stock o ha sido eliminado.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver a la página de inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
