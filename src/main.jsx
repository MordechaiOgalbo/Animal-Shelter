import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastContainer
      position="bottom-left"
      closeOnClick
      ltr
      draggable
      theme="dark"
    />
    <App />
  </BrowserRouter>
);
