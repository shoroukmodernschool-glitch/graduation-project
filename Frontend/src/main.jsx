import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './index.css'
import App from './App.jsx'
import { MaterialUIControllerProvider } from "context";
import theme from "assets/theme";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MaterialUIControllerProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </MaterialUIControllerProvider>
    </ThemeProvider>
  </StrictMode>
)