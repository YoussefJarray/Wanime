import ReactDOM from 'react-dom/client';
import React from "react";
import App from "./App.jsx"; // Fixed import path to include './'
import { initArrowNavigation } from "@arrow-navigation/react";
import "./index.css"; 
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

initArrowNavigation();

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
