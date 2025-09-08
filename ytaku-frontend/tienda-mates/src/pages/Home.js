import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Divider, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import heroImage4 from "../assets/hero4.webp";
import heroImage5 from "../assets/hero5.webp";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { CheckCircleOutline, AttachMoney, Star } from "@mui/icons-material";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const snapshot = await getDocs(collection(db, "productos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const destacadosConStock = data
        .filter((p) => p.destacado && p.variantes?.some((v) => v.stock === true))
        .map((p) => {
          const varianteConStock = p.variantes.find((v) => v.stock);
          return {
            ...p,
            imagen: varianteConStock?.imagenes[0] || "/placeholder.webp",
            precio: p.variantes?.[0]?.precio
              ? `$${Number(p.variantes[0].precio).toLocaleString("es-AR")}`
              : "Sin precio",
          };
        });

      setProductos(destacadosConStock);
      setLoading(false);
    };

    fetchProductos();
  }, []);

  return (
    <>
      {/* Carrusel de imágenes */}
      <Box sx={{ height: { xs: "240px", md: "560px" } }}>
        <Swiper
          modules={[Navigation, Autoplay, EffectCreative]}
          navigation
          autoplay={{ delay: 3000 }}
          effect="creative"
          creativeEffect={{
            prev: {
              translate: [0, 0, -320],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          loop={true}
          style={{
            "--swiper-navigation-color": "#000",
            "--swiper-navigation-size": "20px",
          }}
        >
          {[heroImage5, heroImage4].map((image, index) => (
            <SwiperSlide key={index}>
              <MotionBox
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                sx={{
                  height: { xs: "240px", md: "576px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage: `url(${image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>


      {/* Destacados */}
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <MotionTypography
          variant="h4"
          gutterBottom
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: "center", mb: 4, fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          Los Más Vendidos
        </MotionTypography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ maxWidth: "100%", mx: "auto" }}>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              spaceBetween={10}
              slidesPerView={2}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                },
                960: {
                  slidesPerView: 4,
                },
              }}
              style={{
                "--swiper-navigation-color": "#000",
                "--swiper-navigation-size": "25px",
                padding: "10px 0",
              }}
            >
              {productos.map((producto) => (
                <SwiperSlide key={producto.id} style={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <ProductCard producto={producto} />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Container>

      {/* Separador */}
      <Divider variant="middle" />

      {/* ¿Por qué elegirnos? */}
      <Container sx={{ py: { xs: 4, md: 6 }, borderRadius: 2 }}>
        <MotionTypography
          variant="h4"
          align="center"
          gutterBottom
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          ¿Por qué elegir nuestros mates?
        </MotionTypography>
        <Grid container spacing={6} justifyContent="center">
          {[
            { title: "Compra Directa", description: "De las manos del artesano a tu hogar.", icon: <CheckCircleOutline fontSize="large" /> },
            { title: "Precios Justos", description: "Pagás solo por el mate, no por intermediarios.", icon: <AttachMoney fontSize="large" /> },
            { title: "Materiales Premium", description: "Seleccionamos cada pieza personalmente.", icon: <Star fontSize="large" /> },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                sx={{ textAlign: "center", p: 2 }}
              >
                <Box display="flex" justifyContent="center" mb={2}>
                  {item.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {item.title}
                </Typography>
                <Typography align="center" color="textSecondary">
                  {item.description}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
