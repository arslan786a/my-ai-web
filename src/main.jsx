import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// This function will be called from index.html
window.callMain = function(logFn) {
  logFn("main.jsx picked the call.");

  logFn("Calling App.jsx...");

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App logFn={logFn} />);

  logFn("main.jsx finished calling App.jsx.");
};