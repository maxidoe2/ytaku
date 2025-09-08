import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const variante = producto.variantes?.find((v) => v.stock) || producto.variantes?.[0];
  const precioOriginal = variante?.precio || 0;
  const precio = precioOriginal ? `$${precioOriginal.toLocaleString("es-AR")}` : "Sin precio";

  // Calcula el precio con descuento si hay una oferta
  const precioConDescuento = producto.oferta && producto.montoOferta
    ? precioOriginal * (1 - producto.montoOferta / 100)
    : precioOriginal;

  const precioDescuento = precioConDescuento
    ? `$${precioConDescuento.toLocaleString("es-AR")}`
    : "Sin precio";

  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
          boxShadow: 10,
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: isMobile ? "140px" : "260px",
        backgroundColor: "#fafafa",
        position: "relative",
        margin: isMobile ? "0 auto" : "0",
      }}
      onClick={handleClick}
    >
      {/* Etiqueta de Promoción */}
      {producto.oferta && (
        <Chip
          label={`${producto.montoOferta}% OFF`}
          color="secondary"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: "bold",
            backgroundColor: "#87644b",
            color: "#fff",
            fontSize: isMobile ? "0.6rem" : "0.8rem",
          }}
        />
      )}
      {/* Imagen */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: isMobile ? 140 : 210,
          backgroundColor: "#eaeaea",
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          width="100%"
          image={variante?.imagenes?.[0]}
          alt={producto.nombre}
          sx={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      {/* Contenido */}
      <CardContent
        sx={{
          px: isMobile ? 1.5 : 2.5,
          py: 1.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 1,
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              color: "#333",
            }}
          >
            {producto.nombre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {producto.oferta && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "rgba(0, 0, 0, 0.5)",
                  mr: 1,
                }}
              >
                {precio}
              </Typography>
            )}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: producto.oferta ? "#000000ff" : "rgba(0, 0, 0, 0.9)",
                fontSize: isMobile ? "1rem" : "1.3rem",
                opacity: 0.8,
              }}
            >
              {producto.oferta ? precioDescuento : precio}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Box sx={{ px: isMobile ? 1.5 : 2.5, pb: 2.5 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            backgroundColor: "#000",
            color: "#fff",
            padding: isMobile ? 1 : 1.5,
            "&:hover": {
              backgroundColor: "#444",
            },
            fontSize: isMobile ? "0.8rem" : "1rem",
          }}
        >
          Comprar
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
