import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

//  
import { MaterialUIControllerProvider, useMaterialUIController } from "./dashboard/context";
import theme from "./dashboard/assets/theme";
import darkTheme from "./dashboard/assets/theme-dark"; //   
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 
function AppWrapper() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MaterialUIControllerProvider>
      <AppWrapper />
    </MaterialUIControllerProvider>
  </React.StrictMode>
);