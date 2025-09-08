import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Mates from "./pages/Mates";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import ProductoDetalle from "./components/ProductoDetalle";
import Personaliza from "./pages/Personaliza";
import Envios from "./pages/Envios";
import Contact from "./pages/ContactForm";
import Mayoristas from "./pages/Mayoristas";
import RegalosEmpresariales from "./pages/RegalosEmpresariales";
import Promociones from "./pages/Promociones";
import './App.css';
import WhatsAppButton from "./components/WhatsAppButton";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productos/:tipoURL?" element={<Productos />} />
        <Route path="/mates" element={<Mates />} />
        <Route path="/mates/:subtipo" element={<Mates />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/personaliza" element={<Personaliza />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/mayoristas" element={<Mayoristas />} />
        <Route path="/regalosEmpresariales" element={<RegalosEmpresariales />} />
        <Route path="/promociones" element={<Promociones />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </Router>
  );
};

export default App;
