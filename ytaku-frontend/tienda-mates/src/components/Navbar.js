import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Container,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Fade,
  Badge,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  borderBottom: "1px solid #e0e0e0",
  transition: "transform 0.3s ease",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  color: "#000",
  fontWeight: "600",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.9rem",
  padding: "6px 16px",
  borderRadius: "4px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(108, 99, 255, 0.08)",
    color: "#000",
    transform: "translateY(-1px)",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  minWidth: "180px",
  padding: "10px 20px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(108, 99, 255, 0.08)",
    color: "#6c63ff",
  },
}));

const Navbar = () => {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenu(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Desplaza la página hacia arriba
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const menuItems = [
    { text: "Inicio", path: "/" },
    {
      text: "Nuestros Mates",
      path: "/mates",
      subItems: [
        { text: "Imperiales", path: "/mates/imperiales" },
        { text: "Camioneros", path: "/mates/camioneros" },
       // { text: "Algarrobo", path: "/mates/algarrobo" },
        { text: "Torpedos", path: "/mates/torpedos" },
        { text: "Premium", path: "/mates/premium" },
        { text: "Térmicos", path: "/mates/termicos" },
      ],
    },
    { text: "Personaliza", path: "/personaliza" },
    /**{
      text: "Productos",
      path: "/productos",
      subItems: [
        { text: "Bombillas", path: "/productos/bombillas" },
        { text: "Yerberas", path: "/productos/yerberas" },
        { text: "Chops", path: "/productos/chops" },
        { text: "Termos", path: "/productos/termos" },
        { text: "Combos", path: "/productos/combos" },
        { text: "Matepa", path: "/productos/matepa" },
        { text: "Materas", path: "/productos/materas" },
        { text: "Despovillador", path: "/productos/despovillador" },
      ],
    }, **/
    { text: "Promociones", path: "/promociones" },
    { text: "Envíos", path: "/envios" },
    { text: "Contacto", path: "/contacto" },
    {
      text: "Más",
      subItems: [
        { text: "Mayoristas", path: "/mayoristas" },
        { text: "Regalos Empresariales", path: "/regalosEmpresariales" },
      ]
    }
  ];

  const renderDesktopMenu = () => (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, py: 1 }}>
      {menuItems.map((item) => (
        <Box key={item.text} sx={{ position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledButton
              onClick={() => {
                handleNavigation(item.path);
                handleMenuClose();
              }}
              sx={{ pr: item.subItems ? 0 : undefined }}
            >
              {item.text}
            </StyledButton>
            {item.subItems && (
              <IconButton
                onMouseEnter={(e) => handleMenuOpen(e, item.text)}
                size="small"
                sx={{ ml: 0.5, "&:hover": { backgroundColor: "transparent" } }}
              >
                <ExpandMore />
              </IconButton>
            )}
          </Box>
          {item.subItems && selectedMenu === item.text && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              elevation={3}
              sx={{ mt: 1, "& .MuiPaper-root": { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }}
              MenuListProps={{ onMouseLeave: handleMenuClose }}
            >
              {item.subItems.map((sub) => (
                <StyledMenuItem key={sub.text} onClick={() => {
                  handleNavigation(sub.path);
                  handleMenuClose();
                }}>
                  {sub.text}
                </StyledMenuItem>
              ))}
            </Menu>
          )}
        </Box>
      ))}
    </Box>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{ "& .MuiDrawer-paper": { width: 280, background: "#f8f9fa" } }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <img src={logo} alt="Ytaku" style={{ height: 40 }} />
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": { backgroundColor: "rgba(108, 99, 255, 0.08)" },
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      onClick={() => {
                        handleNavigation(item.path);
                        setDrawerOpen(false);
                        handleMenuClose?.();
                      }}
                      sx={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}
                    >
                      {item.text}
                    </Box>
                  }
                />
                {item.subItems && (
                  <IconButton
                    onClick={() => handleSubMenuToggle(item.text)}
                    size="small"
                    sx={{
                      transform: openSubMenu === item.text ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                )}
              </ListItem>
              {item.subItems && (
                <Collapse in={openSubMenu === item.text} timeout="auto">
                  <List component="div" disablePadding>
                    {item.subItems.map((sub) => (
                      <ListItem
                        key={sub.text}
                        button
                        onClick={() => {
                          handleNavigation(sub.path);
                          setDrawerOpen(false);
                        }}
                        sx={{
                          pl: 4,
                          borderRadius: 1,
                          ml: 2,
                          "&:hover": { backgroundColor: "rgba(108, 99, 255, 0.08)" },
                        }}
                      >
                        <ListItemText primary={sub.text} sx={{ color: "#000" }} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1, minHeight: "64px" }}>
          {isMobile ? (
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "text.primary" }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box />
          )}
          <Box onClick={() => handleNavigation("/")} sx={{ cursor: "pointer" }}>
            <img src={logo} alt="Ytaku" style={{ height: 85, display:'block' }} />
          </Box>
          <IconButton sx={{ color: "text.primary" }} onClick={() => setCartOpen(true)}>
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />
        {!isMobile && renderDesktopMenu()}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </Container>
      {isMobile && renderMobileDrawer()}
    </StyledAppBar>
  );
};

export default Navbar;
