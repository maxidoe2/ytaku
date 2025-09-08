import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (snackbar.open) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [snackbar.open]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    switch (field) {
      case "firstName":
      case "lastName":
        setErrors((prev) => ({
          ...prev,
          [field]: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value) ? "" : "Solo letras",
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: /^\S+@\S+\.\S+$/.test(value) ? "" : "Correo inválido",
        }));
        break;
      case "phone":
        setErrors((prev) => ({
          ...prev,
          phone: /^[0-9+\-\s()]*$/.test(value) ? "" : "Teléfono inválido",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const lastSent = localStorage.getItem("ytaku_last_contact");
    if (lastSent && Date.now() - parseInt(lastSent) < 5 * 60 * 1000) {
      setSnackbar({
        open: true,
        message: "Por favor espera 5 minutos antes de enviar otro mensaje.",
        severity: "warning",
      });
      return;
    }

    const hasError =
      Object.values(errors).some((e) => e) ||
      Object.values(form).some((v) => !v.trim());

    if (hasError) {
      setSnackbar({
        open: true,
        message: "Por favor completá todos los campos correctamente.",
        severity: "error",
      });
      return;
    }

    localStorage.setItem("ytaku_last_contact", Date.now().toString());
    setLoading(true);

    try {
      const res = await fetch("https://ytakucontactapi.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: "¡Mensaje enviado con éxito!",
          severity: "success",
        });
        setForm({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
        setErrors({});
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al enviar: " + error.message,
        severity: "error",
      });
      localStorage.removeItem("ytaku_last_contact");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="center">
            {/* Información izquierda */}
            <Box sx={{ p: 3, flex: 1, maxWidth: { md: "40%" } }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Contáctanos
              </Typography>
              <Typography variant="body1" mb={3}>
                Un miembro de nuestro equipo se pondrá en contacto contigo lo antes posible.
              </Typography>
              <Box mb={2} display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography>+54 9 351 645-9522</Typography>
              </Box>
              <Box mb={2} display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography>+54 9 351 255-2744</Typography>
              </Box>
              <Box mb={2} display="flex" alignItems="center">
                <EmailIcon sx={{ mr: 1 }} />
                <Typography>ytakucba@gmail.com</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography>Córdoba, Argentina</Typography>
              </Box>
            </Box>

            {/* Formulario alineado */}
            <Grid item xs={12} md={7}>
              <Box
                component="form"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
                noValidate
                autoComplete="off"
              >
                {/* Fila 1 */}
                <TextField
                  label="Nombre"
                  fullWidth
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <TextField
                  label="Apellido"
                  fullWidth
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />

                {/* Fila 2 */}
                <TextField
                  label="Teléfono"
                  fullWidth
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Fila 3: Mensaje ocupa 2 columnas */}
                <TextField
                  label="Mensaje"
                  fullWidth
                  multiline
                  rows={6}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  sx={{ gridColumn: { sm: "span 2" } }}
                />

                {/* Botón centrado debajo del mensaje */}
                <Box
                  sx={{
                    gridColumn: { sm: "span 2" },
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      px: 5,
                      py: 1.5,
                      fontWeight: "bold",
                      backgroundColor: "#000",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#222" },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "ENVIAR"}
                  </Button>
                </Box>
              </Box>
            </Grid>

          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactForm;
