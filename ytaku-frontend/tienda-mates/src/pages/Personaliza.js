import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Button, // Asegúrate de importar Button
} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StyleIcon from '@mui/icons-material/Style';
import { keyframes } from "@mui/system";

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

const Personaliza = () => {
  const styles = {
    mainContainer: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f4f6f8 100%)',
      borderRadius: '16px',
      padding: { xs: '20px', md: '40px' },
      my: 4,
    },
    imageWrapper: {
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      marginBottom: 4,
    },
    stepCard: {
      height: '100%',
      transition: 'transform 0.3s ease-in-out',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    },
    iconWrapper: {
      width: 50,
      height: 50,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      marginBottom: 2
    },
  };

  const steps = [
    {
      icon: <ShoppingBagIcon sx={{ color: 'white' }} />,
      title: "Paso 1",
      description: "Realiza la compra del Mate Camionero, Imperial o Algarrobo"
    },
    {
      icon: <WhatsAppIcon sx={{ color: 'white' }} />,
      title: "Paso 2",
      description: "Escribe vía WhatsApp al diseñador mencionando tu número de orden y tu idea de diseño"
    },
    {
      icon: <StyleIcon sx={{ color: 'white' }} />,
      title: "Paso 3",
      description: "Elige la letra y los emojis que más te gusten para crear tu diseño único"
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainContainer}>
        <Box sx={{ textAlign: 'center', mb: 6, animation: `${fadeIn} 1s ease-out` }}>
          <Box sx={{
            ...styles.iconWrapper,
            width: 70,
            height: 70,
            margin: '0 auto 20px',
          }}>
            <EditIcon sx={{ fontSize: 35, color: 'white' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#000',
            }}
          >
            Personaliza tu Mate
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', color: '#333333' }}>
            Crea un mate único que refleje tu estilo personal
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
          {steps.map((step, index) => (
            <Card key={index} sx={styles.stepCard}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={styles.iconWrapper}>
                  {step.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: '#000' }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: '#333333' }}>
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{
          bgcolor: 'rgba(26,35,126,0.03)',
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          animation: `${fadeIn} 1s ease-out 0.6s both`
        }}>
          <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: '#000' }}>
            ¿Listo para personalizar tu mate?
          </Typography>
          <Typography sx={{ color: '#333333', mb: 3 }}>
            Contacta con nuestra diseñadora al
            <Typography component="span" fontWeight="bold" sx={{ mx: 1, color: '#000' }}>
              +54 9 351 645-9522
            </Typography>
            y hace realidad tu diseño
          </Typography>
          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon sx={{ color: '#000000' }} />}
            href="https://wa.me/5493516459522?text=Hola,%20quiero%20personalizar%20el%20mate%20que%20compré."
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#000000',
              backgroundColor: '#ffffff',
              border: '1px solid #000000',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'translateY(-2px)',
                border: '1px solid #000000',
              },
              transition: 'transform 0.2s ease-in-out',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Contactar al Diseñador
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Personaliza;