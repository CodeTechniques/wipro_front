import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./styles/main.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CurrencyProvider>
      <RouterProvider router={router} />
      </CurrencyProvider>
    </AuthProvider>
  </React.StrictMode>
);
