import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { keyframes } from "@mui/system";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import envioImage from "../assets/envios.webp";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Envios = () => {
  const styles = {
    mainContainer: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f4f6f8 100%)',
      borderRadius: '16px',
      padding: { xs: '20px', md: '40px' },
      my: 4,
    },
    iconWrapper: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      margin: '0 auto 20px',
    },
    button: {
      py: 1.5,
      px: 4,
      borderRadius: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainContainer}>
        <Box sx={{ textAlign: 'center', mb: 6, animation: `${fadeIn} 1s ease-out` }}>
          <Box sx={styles.iconWrapper}>
            <LocalShippingIcon sx={{ fontSize: 35, color: 'white' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: '#000',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Envíos
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Información sobre el envío de tus productos
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4, mb: 6 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  ¡Hola! Una vez realizada tu compra, tu producto será enviado a través de la plataforma "Correo OCA". Hasta llegar a destino tendrá una demora de 3 a 4 días hábiles.
                </Typography>
                <Typography variant="body1" paragraph>
                  Podés ver el seguimiento por ACA: <a href="https://www.oca.com.ar/Seguimiento/BuscarEnvio/paquetes" target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', fontWeight: 'bold' }}>Seguimiento de Envío</a>
                </Typography>
                <Typography variant="body1" paragraph>
                  Selecciona Paquete e ingresa el Número de Envío que te mandamos por WhatsApp al concretar la compra!!
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <img src={envioImage} alt="Envío" style={{ maxWidth: "100%", height: "auto", borderRadius: '16px' }} />
          </Box>
        </Box>

        <Box sx={{
          bgcolor: 'rgba(0,0,0,0.03)',
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          animation: `${fadeIn} 1s ease-out 0.6s both`
        }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            ¿Necesitas ayuda con tu envío?
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LocalShippingIcon sx={{ color: '#000' }} />}
            href="https://wa.me/5493516459522?text=Hola,%20necesito%20ayuda%20con%20mi%20envío."
            sx={{
              ...styles.button,
              bgcolor: '#ffffff',
              color: '#000',
              border: '1px solid #000',
              '&:hover': {
                bgcolor: '#f5f5f5',
                border: '1px solid #000',
              },
            }}
          >
            Contactar Soporte de Envíos
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Envios;
