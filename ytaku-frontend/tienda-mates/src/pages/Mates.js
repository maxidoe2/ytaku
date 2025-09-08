import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Fade,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Chip,
  Slider,
  Paper,
  Tooltip,
  Badge,
  InputAdornment,
} from "@mui/material";
import {
  MenuOpen,
  Search,
  Sort,
  FilterList,
  Clear,
  LocalOffer,
  Star,
  NewReleases,
  AttachMoney,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

const Mates = () => {
  const [productos, setProductos] = useState([]);
  const [subtipos, setSubtipos] = useState([]);
  const [selectedSubtipo, setSelectedSubtipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [orden, setOrden] = useState(null);
  const [precioRange, setPrecioRange] = useState([0, 100000]);
  const [busqueda, setBusqueda] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { subtipo: subtipoURL } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productos"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const conStock = data.filter(
          (prod) =>
            prod.tipo === "mates" &&
            prod.variantes?.some((v) => v.stock === true)
        );
        
        const subtiposUnicos = [...new Set(conStock.flatMap((prod) => prod.subtipo))].sort();
        
        // Encontrar precio máximo para el slider
        const maxPrecio = Math.max(...conStock.map(p => 
          Math.max(...p.variantes.map(v => parseFloat(v.precio) || 0))
        ));
        
        setPrecioRange([0, maxPrecio]);
        setProductos(conStock);
        setSubtipos(subtiposUnicos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching productos:", error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (subtipoURL) {
      setSelectedSubtipo(subtipoURL);
    } else {
      setSelectedSubtipo("");
    }
  }, [subtipoURL]);

  useEffect(() => {
    let count = 0;
    if (busqueda) count++;
    if (orden) count++;
    if (selectedSubtipo) count++;
    if (precioRange[0] > 0 || precioRange[1] < 100000) count++;
    setFiltrosAplicados(count);
  }, [busqueda, orden, selectedSubtipo, precioRange]);

  const handleOrdenClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOrdenClose = () => {
    setAnchorEl(null);
  };

  const handleOrdenSelect = (ordenElegido) => {
    setOrden(ordenElegido);
    setAnchorEl(null);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setOrden(null);
    setPrecioRange([0, 100000]);
    navigate("/mates");
  };

  const productosFiltrados = productos
    .filter((p) =>
      selectedSubtipo
        ? Array.isArray(p.subtipo) &&
          p.subtipo.some((s) => s.toLowerCase() === selectedSubtipo.toLowerCase())
        : true
    )
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) => {
      const precio = Math.min(...p.variantes.map(v => parseFloat(v.precio) || 0));
      return precio >= precioRange[0] && precio <= precioRange[1];
    })
    .map((p) => {
      const variante = p.variantes.find((v) => v.stock);
      return {
        ...p,
        imagen: variante?.imagenes[0] || "/placeholder.webp",
        precio: Math.min(...p.variantes.map(v => parseFloat(v.precio) || 0)),
      };
    })
    .sort((a, b) => {
      if (orden === "menor") return a.precio - b.precio;
      if (orden === "mayor") return b.precio - a.precio;
      return 0;
    });

  const handleSubtipoClick = (sub) => {
    if (sub === selectedSubtipo) {
      navigate("/mates");
    } else {
      navigate(`/mates/${sub}`);
    }
  };

  const FiltersSection = () => (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        mb: 3,
        display: showFilters ? 'block' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filtros Avanzados
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>Rango de Precios</Typography>
        <Slider
          value={precioRange}
          onChange={(_, newValue) => setPrecioRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={100000}
          valueLabelFormat={(value) => `$${value.toLocaleString()}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">
            ${precioRange[0].toLocaleString()}
          </Typography>
          <Typography variant="body2">
            ${precioRange[1].toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Container sx={{ py: 6 }}>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Nuestros Mates
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </MotionBox>

      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4 }}>
          {isMobile && (
            <IconButton 
              onClick={() => setDrawerOpen(true)}
              sx={{ alignSelf: 'flex-start' }}
            >
              <MenuOpen />
            </IconButton>
          )}

          <Drawer 
            anchor="left" 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                p: 2
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tipos de Mates
              </Typography>
              <List>
                {subtipos.map((s) => (
                  <ListItem key={s} disablePadding>
                    <ListItemButton
                      selected={s === selectedSubtipo}
                      onClick={() => {
                        handleSubtipoClick(s);
                        setDrawerOpen(false);
                      }}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={s.toUpperCase()}
                        primaryTypographyProps={{ fontWeight: "bold" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {!isMobile && (
            <Paper 
              elevation={3}
              sx={{ 
                width: 280,
                p: 2,
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tipos de Mates
              </Typography>
              <List>
                {subtipos.map((s) => (
                  <ListItem key={s} disablePadding>
                    <ListItemButton
                      selected={s === selectedSubtipo}
                      onClick={() => handleSubtipoClick(s)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={s.toUpperCase()}
                        primaryTypographyProps={{ fontWeight: "bold" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <Box sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                display: "flex", 
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                alignItems: 'center'
              }}
            >
              <TextField
                placeholder="Buscar mate"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: busqueda && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setBusqueda("")}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Tooltip title="Ordenar por precio">
                <Button 
                  onClick={handleOrdenClick}
                  variant="outlined"
                  startIcon={<Sort />}
                >
                  {orden ? (orden === "menor" ? "Menor precio" : "Mayor precio") : "Ordenar"}
                </Button>
              </Tooltip>

              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={handleOrdenClose}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 180 }
                }}
              >
                <MenuItem onClick={() => handleOrdenSelect("menor")}>
                  <AttachMoney /> Menor a mayor
                </MenuItem>
                <MenuItem onClick={() => handleOrdenSelect("mayor")}>
                  <AttachMoney sx={{ transform: 'rotate(180deg)' }} /> Mayor a menor
                </MenuItem>
              </Menu>

              <Tooltip title="Mostrar filtros avanzados">
                <Badge badgeContent={filtrosAplicados} color="primary">
                  <IconButton onClick={() => setShowFilters(!showFilters)}>
                    <FilterList />
                  </IconButton>
                </Badge>
              </Tooltip>

              {filtrosAplicados > 0 && (
                <Button 
                  variant="outlined" 
                  color="error"
                  size="small"
                  onClick={limpiarFiltros}
                  startIcon={<Clear />}
                >
                  Limpiar filtros
                </Button>
              )}
            </Box>

            <FiltersSection />

            {selectedSubtipo && (
              <Chip
                label={selectedSubtipo.toUpperCase()}
                onDelete={() => navigate("/mates")}
                color="primary"
                sx={{ mb: 2 }}
              />
            )}

            <AnimatePresence mode="wait">
              <MotionBox
                key={selectedSubtipo + orden + busqueda}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={3} justifyContent="center">
                  {productosFiltrados.map((producto) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={producto.id}
                    >
                      <MotionBox
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard 
                          producto={producto}
                          elevation={3}
                        />
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>

                {productosFiltrados.length === 0 && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      mt: 3
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron productos que coincidan con los filtros
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={limpiarFiltros}
                      sx={{ mt: 2 }}
                    >
                      Limpiar filtros
                    </Button>
                  </Box>
                )}
              </MotionBox>
            </AnimatePresence>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Mates;
