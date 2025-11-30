import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EditUserProvider } from "./context/EditUserContext";
import App from "./App";
  

// Global styles
import "./styles/global.css";
import "./App.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <EditUserProvider>
    <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  </EditUserProvider>
);
