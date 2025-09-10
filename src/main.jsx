import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

console.log("React entry point loaded");  // ✅ check

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found!");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("React render called");