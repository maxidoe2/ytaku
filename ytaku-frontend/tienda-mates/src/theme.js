// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#ff1744",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeightBold: 700,
  },
});

export default theme;
