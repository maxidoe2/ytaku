import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  IconButton,
  styled,
  InputAdornment,
} from "@mui/material";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";

const primaryColor = "#3f51b5";
const secondaryColor = "#f50057";
const backgroundColor = "#f5f5f5";
const textColor = "#333";

const tipos = [
  "mates",
  "bombillas",
  "yerberas",
  "materos",
  "termos",
  "despolvillador",
  "chops",
  "matepa",
  "combos",
];

const subtiposMates = [
  "imperiales",
  "camioneros",
  "algarrobo",
  "torpedos",
  "premium",
  "termicos",
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  backgroundColor: "#fff",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  padding: "8px 24px",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
  },
}));

const ProductForm = ({ productoEdit, onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    subtipo: [],
    destacado: false,
    oferta: false,
    montoOferta: 0,
    variantes: [],
    opciones: [
      {
        tipo: "empaques",
        items: [
          { tipo: "estandar", precio: 0 },
          { tipo: "premium", precio: 10000 },
        ],
      },
      {
        tipo: "bombillas",
        items: [
          { tipo: "regalo", precio: 0 },
          { tipo: "pico de acero inoxidable", precio: 3500 },
        ],
      },
    ],
  });

  useEffect(() => {
    if (productoEdit) {
      const subtipo = Array.isArray(productoEdit.subtipo)
        ? productoEdit.subtipo
        : [productoEdit.subtipo];
      setForm({ ...productoEdit, subtipo });
    }
  }, [productoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAgregarVariante = () => {
    setForm({
      ...form,
      variantes: [
        ...form.variantes,
        { color: "", imagenes: [], stock: true, precio: "" },
      ],
    });
  };

  const handleVarianteChange = (index, field, value) => {
    const nuevas = [...form.variantes];
    nuevas[index][field] = value;
    setForm({ ...form, variantes: nuevas });
  };

  const handleEliminarVariante = (index) => {
    const nuevas = form.variantes.filter((_, i) => i !== index);
    setForm({ ...form, variantes: nuevas });
  };

  const handleEliminarImagen = (varianteIndex, imagenIndex) => {
    const nuevasVariantes = [...form.variantes];
    nuevasVariantes[varianteIndex].imagenes.splice(imagenIndex, 1);
    setForm({ ...form, variantes: nuevasVariantes });
  };

  const handleOpcionesChange = (opcionIndex, itemIndex, field, value) => {
    const nuevasOpciones = [...form.opciones];
    nuevasOpciones[opcionIndex].items[itemIndex][field] = value;
    setForm({ ...form, opciones: nuevasOpciones });
  };

  const moveImage = (varianteIndex, imagenIndex, direction) => {
    const nuevasVariantes = [...form.variantes];
    const imagenes = [...nuevasVariantes[varianteIndex].imagenes];
    if (direction === "left" && imagenIndex > 0) {
      [imagenes[imagenIndex], imagenes[imagenIndex - 1]] = [
        imagenes[imagenIndex - 1],
        imagenes[imagenIndex],
      ];
    } else if (direction === "right" && imagenIndex < imagenes.length - 1) {
      [imagenes[imagenIndex], imagenes[imagenIndex + 1]] = [
        imagenes[imagenIndex + 1],
        imagenes[imagenIndex],
      ];
    }
    nuevasVariantes[varianteIndex].imagenes = imagenes;
    setForm({ ...form, variantes: nuevasVariantes });
  };

  const convertToWebpBase64 = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataURL = canvas.toDataURL("image/webp", 0.8);
          const base64 = dataURL.split(",")[1];
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImageToImgBB = async (base64Image) => {
    const formData = new FormData();
    formData.append("image", base64Image);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error(
        "Error uploading image to ImgBB:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const maxWidth = 800;
      const maxHeight = 800;
      const base64Webp = await convertToWebpBase64(file, maxWidth, maxHeight);
      const imageUrl = await uploadImageToImgBB(base64Webp);
      if (imageUrl) {
        const nuevas = [...form.variantes];
        nuevas[index].imagenes.push(imageUrl);
        setForm({ ...form, variantes: nuevas });
      }
    } catch (err) {
      console.error("Error en el proceso de imagen:", err);
    }
  };

  const validateForm = () => {
    if (
      !form.nombre ||
      !form.tipo ||
      form.variantes.some((v) => !v.precio)
    ) {
      alert("Por favor, complete los campos obligatorios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (productoEdit?.id) {
        await updateDoc(doc(db, "productos", productoEdit.id), form);
      } else {
        await addDoc(collection(db, "productos"), form);
      }
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={6}>
          <StyledFormControl fullWidth required>
            <InputLabel>Tipo</InputLabel>
            <Select
              name="tipo"
              value={form.tipo}
              label="Tipo"
              onChange={handleChange}
            >
              {tipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid item xs={6}>
          {form.tipo === "mates" && (
            <StyledFormControl fullWidth>
              <InputLabel>Subtipo</InputLabel>
              <Select
                name="subtipo"
                multiple
                value={form.subtipo}
                label="Subtipo"
                onChange={(e) => setForm({ ...form, subtipo: e.target.value })}
                renderValue={(selected) => selected.join(", ")}
              >
                {subtiposMates.map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          )}
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={form.destacado}
                onChange={(e) =>
                  setForm({ ...form, destacado: e.target.checked })
                }
              />
            }
            label="Destacado"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={form.oferta}
                onChange={(e) => setForm({ ...form, oferta: e.target.checked })}
              />
            }
            label="Oferta"
          />
          {form.oferta && (
            <StyledTextField
              fullWidth
              label="Monto de Oferta"
              type="number"
              value={form.montoOferta}
              onChange={(e) =>
                setForm({ ...form, montoOferta: parseInt(e.target.value) })
              }
              inputProps={{ min: 1, max: 100 }}
            />
          )}
        </Grid>
        {form.tipo === "mates" && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2, color: primaryColor }}>
                Opciones de Empaques
              </Typography>
              {form.opciones
                .find((opcion) => opcion.tipo === "empaques")
                ?.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 2,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <StyledTextField
                          fullWidth
                          label="Tipo"
                          value={item.tipo}
                          onChange={(e) =>
                            handleOpcionesChange(0, index, "tipo", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <StyledTextField
                          fullWidth
                          label="Precio"
                          type="number"
                          value={item.precio}
                          onChange={(e) =>
                            handleOpcionesChange(
                              0,
                              index,
                              "precio",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2, color: primaryColor }}>
                Opciones de Bombillas
              </Typography>
              {form.opciones
                .find((opcion) => opcion.tipo === "bombillas")
                ?.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 2,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <StyledTextField
                          fullWidth
                          label="Tipo"
                          value={item.tipo}
                          onChange={(e) =>
                            handleOpcionesChange(1, index, "tipo", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <StyledTextField
                          fullWidth
                          label="Precio"
                          type="number"
                          value={item.precio}
                          onChange={(e) =>
                            handleOpcionesChange(
                              1,
                              index,
                              "precio",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 2, color: primaryColor }}>
            Variantes
          </Typography>
          <StyledButton
            variant="outlined"
            onClick={handleAgregarVariante}
            startIcon={<AddIcon />}
            sx={{ mb: 2, color: primaryColor, borderColor: primaryColor }}
          >
            Agregar Variante
          </StyledButton>
          {form.variantes.map((v, index) => (
            <Box
              key={index}
              sx={{
                mt: 2,
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledTextField
                    fullWidth
                    label="Color"
                    value={v.color}
                    onChange={(e) =>
                      handleVarianteChange(index, "color", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    fullWidth
                    label="Precio"
                    type="number"
                    value={v.precio}
                    onChange={(e) =>
                      handleVarianteChange(index, "precio", e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledButton
                    variant="contained"
                    component="label"
                    sx={{
                      background: primaryColor,
                    }}
                  >
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </StyledButton>
                  {v.imagenes.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {v.imagenes.map((img, imgIndex) => (
                        <Box
                          key={imgIndex}
                          sx={{
                            position: "relative",
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={img}
                            alt={`Preview ${imgIndex}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Box sx={{ position: "absolute", top: 0, display: "flex", width: "100%", justifyContent: "space-between" }}>
                            <IconButton
                              onClick={() => moveImage(index, imgIndex, "left")}
                              sx={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                              disabled={imgIndex === 0}
                            >
                              <ArrowBackIosIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => moveImage(index, imgIndex, "right")}
                              sx={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                              disabled={imgIndex === v.imagenes.length - 1}
                            >
                              <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <IconButton
                            onClick={() => handleEliminarImagen(index, imgIndex)}
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              color: "secondaryColor",
                              backgroundColor: "#fff",
                              opacity: 0.9
                            }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={v.stock}
                        onChange={(e) =>
                          handleVarianteChange(index, "stock", e.target.checked)
                        }
                      />
                    }
                    label="En Stock"
                  />
                </Grid>
              </Grid>
              <IconButton
                onClick={() => handleEliminarVariante(index)}
                color="error"
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          <StyledButton
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background: primaryColor,
              "&:hover": {
                background: "#303f9f",
              },
            }}
          >
            Guardar
          </StyledButton>
        </Grid>
      </Grid>
    </form>
  );
};

const AdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const fetchProductos = async () => {
    const snapshot = await getDocs(collection(db, "productos"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (producto) => {
    setProductoEdit(producto);
    setOpenForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await deleteDoc(doc(db, "productos", id));
      fetchProductos();
    }
  };

  const handleClose = () => {
    setOpenForm(false);
    setProductoEdit(null);
    fetchProductos();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5, backgroundColor: backgroundColor }}>
      <Box
        sx={{
          background: primaryColor,
          borderRadius: 4,
          color: "white",
          p: 4,
          mb: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Panel de Administración
          </Typography>
          <StyledButton
            variant="contained"
            onClick={handleLogout}
            sx={{ bgcolor: secondaryColor }}
          >
            Cerrar sesión
          </StyledButton>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <StyledButton
          variant="contained"
          onClick={() => setOpenForm(true)}
          startIcon={<AddIcon />}
          sx={{
            background: primaryColor,
            color: "white",
            "&:hover": {
              background: "#303f9f",
            },
          }}
        >
          Agregar producto
        </StyledButton>
        <StyledTextField
          fullWidth
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {productosFiltrados.map((prod) => (
          <Grid item xs={12} sm={6} md={4} key={prod.id}>
            <StyledPaper>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color={textColor}>
                  {prod.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textTransform: "capitalize",
                  }}
                >
                  {prod.tipo}
                </Typography>
              </Box>
              {prod.variantes && prod.variantes[0]?.imagenes[0] && (
                <Box
                  sx={{
                    height: 200,
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={prod.variantes[0].imagenes[0]}
                    alt={prod.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <StyledButton
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditar(prod)}
                  startIcon={<EditIcon />}
                  sx={{ color: primaryColor, borderColor: primaryColor }}
                >
                  Editar
                </StyledButton>
                <StyledButton
                  size="small"
                  variant="outlined"
                  onClick={() => handleEliminar(prod.id)}
                  startIcon={<DeleteIcon />}
                  sx={{ color: secondaryColor, borderColor: secondaryColor }}
                >
                  Eliminar
                </StyledButton>
              </Box>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
      <StyledDialog
        open={openForm}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 3, fontWeight: "bold", color: primaryColor }} >
          {productoEdit ? "Editar producto" : "Agregar producto"}
        </DialogTitle>
        <DialogContent>
          <ProductForm productoEdit={productoEdit} onClose={handleClose} />
        </DialogContent>
      </StyledDialog>
    </Container>
  );
};

export default AdminPanel;
