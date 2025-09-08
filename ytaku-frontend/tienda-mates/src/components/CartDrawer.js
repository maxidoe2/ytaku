// src/components/CartDrawer.js
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleWhatsApp = () => {
    const msg = cartItems
      .map((item) => {
        const empaqueMsg = item.tipo === "mates" ? `, Empaque: ${item.empaque}` : "";
        const bombillaMsg = item.tipo === "mates" ? `, Bombilla: ${item.bombilla}` : "";
        return `- ${item.nombre} (${item.variante}${empaqueMsg}${bombillaMsg}) x${item.cantidad} = $${item.precio * item.cantidad}`;
      })
      .join("\n");

    const totalMsg = `\n\nTotal: $${total}`;
    const fullMsg = `Hola, quiero comprar:\n${msg}${totalMsg}`;

    window.open(
      `https://wa.me/5493516459522?text=${encodeURIComponent(fullMsg)}`,
      "_blank"
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Carrito
        </Typography>
        <Divider sx={{ my: 2 }} />

        {cartItems.length === 0 ? (
          <Typography variant="body2">Tu carrito está vacío.</Typography>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.nombre}
                </Typography>
                <Typography variant="body2">
                  Variante: {item.variante}
                </Typography>
                {item.tipo === "mates" && (
                  <>
                    <Typography variant="body2">
                      Empaque: {item.empaque}
                    </Typography>
                    <Typography variant="body2">
                      Bombilla: {item.bombilla}
                    </Typography>
                  </>
                )}
                <TextField
                  label="Cantidad"
                  type="number"
                  value={item.cantidad}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      item.variante,
                      parseInt(e.target.value),
                      item.empaque,
                      item.bombilla
                    )
                  }
                  inputProps={{ min: 1, max: 999 }}
                  size="small"
                  sx={{ width: 100, mt: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Precio total: ${item.precio * item.cantidad}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() =>
                    removeFromCart(item.id, item.variante, item.empaque, item.bombilla)
                  }
                >
                  <DeleteIcon />
                </IconButton>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Total: ${total}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsApp}
              sx={{ mt: 2 }}
            >
              Enviar por WhatsApp
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{ mt: 1 }}
            >
              Vaciar Carrito
            </Button>
          </>
        )}
        <Button fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
