  import React from "react";
  import {
    Box,
    Typography,
    Link,
    Grid,
    IconButton,
    Container,
  } from "@mui/material";
  import InstagramIcon from "@mui/icons-material/Instagram";
  import FacebookIcon from "@mui/icons-material/Facebook";
  import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
  import EmailIcon from "@mui/icons-material/Email";

  const Footer = () => {
    const footerLinks = [
      { name: "Inicio", path: "/" },
      { name: "Nuestros Mates", path: "/mates" },
      { name: "Personaliza", path: "/personaliza" },
     // { name: "Productos", path: "/productos" },
      { name: "Envíos", path: "/envios" },
      { name: "Contacto", path: "/contacto" },
      { name: "Mayoristas", path: "/mayoristas" },
      { name: "Regalos Empresariales", path: "/regalosEmpresariales" },
      { name: "Promociones", path: "/promociones" },
    ];

    return (
      <Box
        component="footer"
        sx={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          pt: 8,
          pb: 6,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            {/* Branding */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  position: "relative",
                  mb: 2,
                }}
              >
                Ytaku
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaaaaa" }}>
                Descubre la mejor selección de mates y accesorios para disfrutar de tu bebida favorita.
              </Typography>
            </Grid>

            {/* Categorías */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  position: "relative",
                }}
              >
                Categorías
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {footerLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    sx={{
                      color: "#aaaaaa",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "#ffffff",
                        transform: "translateX(8px)",
                      },
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contacto */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  position: "relative",
                }}
              >
                Contacto
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateX(8px)" },
                  }}
                >
                  <LocalPhoneIcon sx={{ mr: 1, color: "#aaaaaa" }} />
                  <Link
                    href="https://wa.me/5493516459522?text=Hola,%20estoy%20interesado/a%20en%20más%20información"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography color="#aaaaaa">+54 9 351 645-9522</Typography>
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateX(8px)" },
                  }}
                >
                  <LocalPhoneIcon sx={{ mr: 1, color: "#aaaaaa" }} />
                  <Link
                    href="https://wa.me/5493512552744?text=Hola,%20estoy%20interesado/a%20en%20más%20información"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography color="#aaaaaa">+54 9 351 255-2744</Typography>
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateX(8px)" },
                  }}
                >
                  <EmailIcon sx={{ mr: 1, color: "#aaaaaa" }} />
                  <Link
                    href="mailto:ytakucba@gmail.com?subject=Interesado%20en%20más%20información&body=Hola,%20estoy%20interesado/a%20en%20más%20información"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography color="#aaaaaa">ytakucba@gmail.com</Typography>
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Redes Sociales */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  position: "relative",
                }}
              >
                Síguenos
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  component="a"
                  href="https://www.instagram.com/ytakumates.cba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#555555",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.facebook.com/ytakumates"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#555555",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Legal */}
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: "#aaaaaa",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 3,
              mt: 6,
            }}
          >
            © 2025 Ytaku. Todos los derechos reservados. Diseñado por Máximo Estudillo.
          </Typography>
        </Container>
      </Box>
    );
  };

  export default Footer;
