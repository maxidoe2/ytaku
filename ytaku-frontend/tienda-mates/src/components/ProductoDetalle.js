import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  TextField,
  Chip,
  Fade,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { keyframes } from "@mui/system";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import NotFound from "./NotFound";
import CloseIcon from '@mui/icons-material/Close';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [precioFinal, setPrecioFinal] = useState(0);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [empaque, setEmpaque] = useState("estandar");
  const [bombilla, setBombilla] = useState("regalo");
  const [index, setIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const imageSectionRef = useRef(null);

  const paymentMethods = {
    mercadopago: {
      name: 'MercadoPago',
      icon: <PaymentIcon fontSize="large" />,
      details: {
        title: 'Pago con MercadoPago',
        description: 'Puedes pagar con tarjeta de crédito, débito o dinero en cuenta de MercadoPago utilizando los datos del apartado de Transferencia Bancaria.',
      },
    },
    transferencia: {
      name: 'Transferencia Bancaria',
      icon: <AccountBalanceIcon fontSize="large" />,
      details: {
        title: 'Transferencia Bancaria',
        description: 'Realiza una transferencia a nuestra cuenta bancaria.',
        accountHolder: 'Juliana Maria Russo Muriel',
        cbu: '0000003100058654721224',
        alias: '-',
      },
    },
  };

  useEffect(() => {
    const fetchProducto = async () => {
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productoData = { id: docSnap.id, ...docSnap.data() };
        setProducto(productoData);
        const primeraVarianteDisponible = productoData.variantes.find(v => v.stock);
        setVarianteSeleccionada(primeraVarianteDisponible);
        if (primeraVarianteDisponible) {
          setImagenSeleccionada(primeraVarianteDisponible.imagenes[0]);
          const precioConDescuento = primeraVarianteDisponible.precio * (1 - (productoData.montoOferta || 0) / 100);
          setPrecioFinal(precioConDescuento);
        }
      }
      setLoading(false);
    };
    fetchProducto();
  }, [id]);

  useEffect(() => {
    const fetchProductosRelacionados = async () => {
      if (!producto) return;
      const productosRef = collection(db, "productos");
      const tiposExcluidos = producto.tipo ? [producto.tipo] : [];
      const q = query(productosRef, where("tipo", "not-in", tiposExcluidos));
      const querySnapshot = await getDocs(q);
      let productos = querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        const primeraVarianteDisponible = data.variantes.find(v => v.stock);
        return {
          ...data,
          imagen: primeraVarianteDisponible?.imagenes[0] || "/placeholder.webp",
          precio: primeraVarianteDisponible?.precio || 0,
        };
      });
      productos = productos.filter(producto => producto.variantes.some(variante => variante.stock));
      productos = productos.slice(0, 4);
      if (productos.length < 4) {
        const qTodos = query(productosRef);
        const querySnapshotTodos = await getDocs(qTodos);
        const todosLosProductos = querySnapshotTodos.docs.map(doc => {
          const data = { id: doc.id, ...doc.data() };
          const primeraVarianteDisponible = data.variantes.find(v => v.stock);
          return {
            ...data,
            imagen: primeraVarianteDisponible?.imagenes[0] || "/placeholder.webp",
            precio: primeraVarianteDisponible?.precio || 0,
          };
        }).filter(producto => producto.variantes.some(variante => variante.stock));
        const productosCombinados = [...productos, ...todosLosProductos];
        const productosUnicos = Array.from(new Set(productosCombinados.map(p => p.id)))
          .map(id => productosCombinados.find(p => p.id === id))
          .slice(0, 4);
        productos = productosUnicos;
      }
      setProductosRelacionados(productos);
    };
    fetchProductosRelacionados();
  }, [producto]);

  useEffect(() => {
    if (varianteSeleccionada && producto?.opciones) {
      const precioBase = parseFloat(varianteSeleccionada.precio) || 0;
      const empaqueSeleccionado = parseFloat(producto.opciones.find(opcion => opcion.tipo === 'empaques')?.items.find(item => item.tipo === empaque)?.precio) || 0;
      
      // Solo incluir el precio de la bombilla si hay bombillas válidas
      let bombillaSeleccionada = 0;
      if (hasBombillasValidas()) {
        bombillaSeleccionada = parseFloat(producto.opciones.find(opcion => opcion.tipo === 'bombillas')?.items.find(item => item.tipo === bombilla)?.precio) || 0;
      }
      
      const precioConOpciones = precioBase + empaqueSeleccionado + bombillaSeleccionada;
      const precioConDescuento = producto.oferta
        ? precioConOpciones * (1 - (producto.montoOferta || 0) / 100)
        : precioConOpciones;
      setPrecioFinal(precioConDescuento);
    }
  }, [empaque, bombilla, varianteSeleccionada, producto]);

  const handleChangeIndex = (index) => {
    setIndex(index);
    setImagenSeleccionada(varianteSeleccionada.imagenes[index]);
  };

  const handleAddToCart = () => {
    if (!producto || !varianteSeleccionada) return;
    
    // Si no hay bombillas válidas, usar un valor predeterminado o null
    const bombillaFinal = hasBombillasValidas() ? bombilla : null;
    
    addToCart(
      producto, 
      varianteSeleccionada.color, 
      parseInt(cantidad), 
      precioFinal, 
      empaque, 
      bombillaFinal
    );
  };

  const handleWhatsAppClick = () => {
    if (!producto || !varianteSeleccionada) return;
    
    let mensaje = `Hola, me interesa el producto ${producto.nombre} en la variante ${varianteSeleccionada?.color}, empaque ${empaque}`;
    
    // Solo incluir información de bombilla si hay bombillas válidas
    if (hasBombillasValidas()) {
      mensaje += `, bombilla ${bombilla}`;
    }
    
    mensaje += `, y quiero ${cantidad} unidades.`;
    
    const numeroWhatsApp = "+5493516459522";
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handleVarianteClick = (variante) => {
    if (variante.stock) {
      setVarianteSeleccionada(variante);
      setImagenSeleccionada(variante.imagenes[0]);
      setIndex(0);
    }
  };

  const handleThumbnailClick = (imagen, index) => {
    setImagenSeleccionada(imagen);
    setIndex(index);
  };

  const getFontSize = (name) => {
    const length = name.length;
    if (length > 30) {
      return '1.2rem';
    } else if (length > 20) {
      return '1.5rem';
    } else {
      return '1.8rem';
    }
  };

  const handleOpenDialog = (method) => {
    setSelectedPaymentMethod(method);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para verificar si hay bombillas disponibles y válidas
  const hasBombillasValidas = () => {
    const bombillasOpcion = producto?.opciones?.find(opcion => opcion.tipo === 'bombillas');
    if (!bombillasOpcion || !bombillasOpcion.items || bombillasOpcion.items.length === 0) {
      return false;
    }
    
    // Verificar que al menos una bombilla tenga un precio válido (no NaN)
    return bombillasOpcion.items.some(item => !isNaN(parseFloat(item.precio)));
  };

  const styles = {
    card: {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      transition: 'transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
      },
    },
    price: {
      color: '#000000',
      fontSize: '2.2rem',
      fontWeight: 'bold',
      opacity: 0.9,
      animation: `${fadeIn} 1s ease-in`,
    },
    button: {
      borderRadius: '12px',
      padding: '12px 24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      },
    },
    whatsappButton: {
      background: 'linear-gradient(45deg, #25D366 30%, #128C7E 90%)',
      color: 'white',
      '&:hover': {
        background: 'linear-gradient(45deg, #128C7E 30%, #075E54 90%)',
      },
    },
    cartButton: {
      background: 'linear-gradient(45deg, #1976D2 30%, #0D47A1 90%)',
      color: 'white',
      '&:hover': {
        background: 'linear-gradient(45deg, #0D47A1 30%, #0D47A1 90%)',
      },
    },
    descriptionBox: {
      backgroundColor: '#f9f9f9',
      padding: '25px',
      borderRadius: '12px',
      animation: `${fadeIn} 1s ease-in`,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
    },
    chip: {
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    cardMedia: {
      transition: 'transform 0.5s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    container: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '25px',
      animation: `${fadeIn} 1s ease-in`,
      backgroundColor: '#ffffff',
    },
    title: {
      animation: `${fadeIn} 1s ease-in`,
      fontWeight: 'bold',
    },
    relatedProductCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.04)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      },
      margin: '0 auto',
    },
    relatedProductMedia: {
      height: 160,
      objectFit: 'cover',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      width: '100%',
    },
    thumbnailContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      marginBottom: isMobile ? '16px' : '0',
      overflowX: isMobile ? 'auto' : 'hidden',
      '& img': {
        marginRight: isMobile ? '16px' : '0',
        marginBottom: isMobile ? '0' : '16px',
        cursor: 'pointer',
        borderRadius: '8px',
        border: '2px solid #ddd',
        width: isMobile ? '80px' : '60px',
        height: isMobile ? '80px' : '60px',
        objectFit: 'cover',
      },
    },
    mainImageContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '100%' : '400px',
      height: isMobile ? 'auto' : '400px',
    },
    paymentCard: {
      cursor: 'pointer',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  };

  if (loading) {
    return <Box textAlign="center" mt={6}><CircularProgress /></Box>;
  }

  if (!producto) {
    return <NotFound />;
  }

  const precioOriginal = parseFloat(varianteSeleccionada?.precio) || 0;
  const empaqueSeleccionado = parseFloat(producto.opciones?.find(opcion => opcion.tipo === 'empaques')?.items.find(item => item.tipo === empaque)?.precio) || 0;
  
  // Solo incluir el precio de la bombilla si hay bombillas válidas
  let bombillaSeleccionada = 0;
  if (hasBombillasValidas()) {
    bombillaSeleccionada = parseFloat(producto.opciones?.find(opcion => opcion.tipo === 'bombillas')?.items.find(item => item.tipo === bombilla)?.precio) || 0;
  }
  
  const precioOriginalConOpciones = precioOriginal + empaqueSeleccionado + bombillaSeleccionada;

  // Verificar si hay bombillas válidas
  const mostrarSeccionBombillas = hasBombillasValidas();

  return (
    <Container sx={{ ...styles.container, py: 6 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, color: "#000", borderColor: "#000" }}>
        Volver
      </Button>
      <Fade in timeout={800}>
        <Grid container spacing={4} ref={imageSectionRef}>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
              {!isMobile && (
                <Box sx={styles.thumbnailContainer}>
                  {varianteSeleccionada?.imagenes.map((imagen, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      image={imagen || "/placeholder.webp"}
                      alt={`Thumbnail ${index}`}
                      onClick={() => handleThumbnailClick(imagen, index)}
                    />
                  ))}
                </Box>
              )}
              <Box sx={styles.mainImageContainer}>
                <Card sx={{ ...styles.card, animation: `${fadeIn} 1s ease-in`, flex: 1 }}>
                  {isMobile ? (
                    <AutoPlaySwipeableViews
                      index={index}
                      onChangeIndex={handleChangeIndex}
                      enableMouseEvents
                      interval={3000}
                    >
                      {varianteSeleccionada?.imagenes.map((imagen, index) => (
                        <div key={index}>
                          <CardMedia
                            component="img"
                            image={imagen || "/placeholder.webp"}
                            alt={`Slide ${index}`}
                            sx={{ ...styles.cardMedia, objectFit: "cover", borderRadius: '12px', height: '400px' }}
                          />
                        </div>
                      ))}
                    </AutoPlaySwipeableViews>
                  ) : (
                    <CardMedia
                      component="img"
                      image={imagenSeleccionada || "/placeholder.webp"}
                      alt={`${producto.nombre} - ${varianteSeleccionada?.color}`}
                      sx={{ ...styles.cardMedia, objectFit: "cover", borderRadius: '12px', height: '400px' }}
                    />
                  )}
                </Card>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ ...styles.title, fontSize: getFontSize(producto.nombre) }}>
              {producto.nombre}
            </Typography>
            {producto.oferta && (
              <Chip
                label={`${producto.montoOferta}% OFF`}
                color="secondary"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#87644b",
                  color: "#fff",
                  mb: 2,
                }}
              />
            )}
            <Box display="flex" alignItems="center">
              {producto.oferta && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "rgba(0, 0, 0, 0.5)",
                    mr: 1,
                  }}
                >
                  ${precioOriginalConOpciones.toLocaleString("es-AR")}
                </Typography>
              )}
              <Typography variant="h6" gutterBottom sx={styles.price}>
                ${precioFinal.toLocaleString("es-AR")}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Selecciona una variante:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, overflowX: "auto" }}>
                {producto.variantes.map((variante, index) => (
                  <Chip
                    key={index}
                    label={variante.color}
                    onClick={() => handleVarianteClick(variante)}
                    sx={{
                      ...styles.chip,
                      backgroundColor: varianteSeleccionada?.color === variante.color ? "#E6F4EA" : variante.stock ? "white" : "#F2F2F2",
                      color: varianteSeleccionada?.color === variante.color ? "black" : variante.stock ? "black" : "#9E9E9E",
                      border: variante.stock ? "1px solid #ccc" : "none",
                      cursor: variante.stock ? "pointer" : "not-allowed",
                    }}
                  />
                ))}
              </Box>
            </Box>
            {producto.tipo === "mates" && producto.opciones && (
              <>
                <Box mt={2}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" gutterBottom>
                      Selecciona un empaque:
                    </Typography>
                    <RadioGroup row value={empaque} onChange={(e) => setEmpaque(e.target.value)}>
                      {producto.opciones.find(opcion => opcion.tipo === "empaques")?.items.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          value={item.tipo}
                          control={<Radio />}
                          label={`${item.tipo} (+$${item.precio})`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
                {mostrarSeccionBombillas && (
                  <Box mt={2}>
                    <FormControl component="fieldset">
                      <Typography variant="subtitle2" gutterBottom>
                        Selecciona una bombilla:
                      </Typography>
                      <RadioGroup row value={bombilla} onChange={(e) => setBombilla(e.target.value)}>
                        {producto.opciones.find(opcion => opcion.tipo === "bombillas")?.items
                          .filter(item => !isNaN(parseFloat(item.precio)))
                          .map((item, index) => (
                            <FormControlLabel
                              key={index}
                              value={item.tipo}
                              control={<Radio />}
                              label={`${item.tipo} (+$${item.precio})`}
                            />
                          ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}
              </>
            )}
            <Box mt={2}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ mr: 2 }}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppClick}
                disabled={!varianteSeleccionada?.stock}
                sx={{ ...styles.button, ...styles.whatsappButton, flex: 1 }}
              >
                Comprar por WhatsApp
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                sx={{ ...styles.button, ...styles.cartButton, flex: 1 }}
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Fade>
      <Box mt={6}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Métodos de Pago
        </Typography>
        <Box display="flex" gap={2} justifyContent="flex-start">
          {Object.keys(paymentMethods).map((method) => (
            <Card
              key={method}
              onClick={() => handleOpenDialog(method)}
              sx={styles.paymentCard}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
                <IconButton color="primary">
                  {paymentMethods[method].icon}
                </IconButton>
                <Typography variant="h6" sx={{ mt: 1 }}>{paymentMethods[method].name}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      <Box mt={6}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Descripción
        </Typography>
        <Box sx={styles.descriptionBox}>
          <Typography variant="body1">
            {producto.descripcion}
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedPaymentMethod && paymentMethods[selectedPaymentMethod].details.title}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              border: '2px solid rgb(0, 0, 0)',
              borderRadius: '50%',
              padding: '4px',
              opacity: 0.8,
              color: '#000000',
              '&:hover': {
                backgroundColor: '#f6f2f2',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary={selectedPaymentMethod && paymentMethods[selectedPaymentMethod].details.description} />
            </ListItem>
            {selectedPaymentMethod === 'transferencia' && (
              <>
                <ListItem>
                  <ListItemText primary={`Titular: ${paymentMethods.transferencia.details.accountHolder}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`CBU: ${paymentMethods.transferencia.details.cbu}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Alias: ${paymentMethods.transferencia.details.alias}`} />
                </ListItem>
              </>
            )}
          </List>
        </DialogContent>
      </Dialog>
      <Box mt={6}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Combiná con...
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {productosRelacionados.map((productoRelacionado) => (
            <Grid item xs={12} sm={6} md={3} key={productoRelacionado.id}>
              <ProductCard producto={productoRelacionado} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductoDetalle;
