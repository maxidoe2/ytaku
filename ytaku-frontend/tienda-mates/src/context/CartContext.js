// src/context/CartContext.js
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (producto, variante, cantidad = 1, precioFinal, empaque, bombilla) => {
    setCartItems((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.id === producto.id &&
          item.variante === variante &&
          item.empaque === empaque &&
          item.bombilla === bombilla
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index].cantidad += cantidad;
        updated[index].precio = precioFinal;
        return updated;
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: precioFinal,
          variante,
          cantidad,
          empaque,
          bombilla, // Incluye la bombilla seleccionada
          tipo: producto.tipo,
        },
      ];
    });
  };

  const updateQuantity = (productoId, variante, nuevaCantidad, empaque, bombilla) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productoId &&
        item.variante === variante &&
        item.empaque === empaque &&
        item.bombilla === bombilla
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const removeFromCart = (productoId, variante, empaque, bombilla) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productoId &&
            item.variante === variante &&
            item.empaque === empaque &&
            item.bombilla === bombilla
          )
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
