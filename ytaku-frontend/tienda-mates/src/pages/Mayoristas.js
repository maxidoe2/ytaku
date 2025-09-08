import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { keyframes } from "@mui/system";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';

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

const Mayoristas = () => {
  const styles = {
    mainContainer: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f4f6f8 100%)',
      borderRadius: '16px',
      padding: { xs: '20px', md: '40px' },
      my: 4,
    },
    benefitCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      },
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

  const benefits = [
    {
      icon: <LocalMallIcon sx={{ color: 'white', fontSize: 30 }} />,
      title: "Productos Exclusivos",
      description: "Acceso a nuestra línea completa de productos con precios especiales"
    },
    {
      icon: <AttachMoneyIcon sx={{ color: 'white', fontSize: 30 }} />,
      title: "Precios Mayoristas",
      description: "Márgenes atractivos y descuentos por volumen de compra"
    },
    {
      icon: <GroupsIcon sx={{ color: 'white', fontSize: 30 }} />,
      title: "Soporte Dedicado",
      description: "Atención personalizada y asesoramiento continuo"
    },
  ];

  const handleWhatsAppClick = (phoneNumber) => {
    const message = "Hola, estoy interesado en el catálogo para mayoristas.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEmailClick = () => {
    const subject = "MAYORISTA - Interesado en catálogo";
    window.open(`mailto:ytakucba@gmail.com?subject=${encodeURIComponent(subject)}`, "_blank");
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainContainer}>
        <Box sx={{ textAlign: 'center', mb: 6, animation: `${fadeIn} 1s ease-out` }}>
          <Box sx={styles.iconWrapper}>
            <BusinessIcon sx={{ fontSize: 35, color: 'white' }} />
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
            Programa Mayorista
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Únete a nuestra red de distribuidores y accede a beneficios exclusivos
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index} display="flex" justifyContent="center">
              <Card sx={{
                ...styles.benefitCard,
                maxWidth: 340,
                animation: `${fadeIn} 0.6s ease-out ${index * 0.2}s both`
              }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={styles.iconWrapper}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {benefit.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{
          bgcolor: 'rgba(44,56,126,0.03)',
          p: 4,
          borderRadius: 4,
          animation: `${fadeIn} 1s ease-out 0.6s both`
        }}>
          <Typography variant="h5" textAlign="center" gutterBottom fontWeight={600}>
            Contacta con Nuestro Equipo
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 500,
            mx: 'auto',
            mt: 3
          }}>
            {["5493516459522","5493512552744"].map((number, index) => (
              <Button
                key={index}
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={() => handleWhatsAppClick(number)}
                sx={{
                  ...styles.button,
                  bgcolor: '#25D366',
                  '&:hover': { bgcolor: '#128C7E' }
                }}
              >
                WhatsApp: +{number.slice(0, 2)} 9 {number.slice(3, 6)} {number.slice(6,9)}-{number.slice(9)}
              </Button>
            ))}
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleEmailClick}
              sx={{
                ...styles.button,
                bgcolor: '#D44638',
                '&:hover': { bgcolor: '#B33527' }
              }}
            >
              Email: ytakucba@gmail.com
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Mayoristas;
