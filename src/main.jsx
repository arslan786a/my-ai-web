import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Expose a function to be called from index.html
window.callMain = function () {
  console.log("main.jsx function called from index.html button");

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);

  console.log("App.jsx rendered by main.jsx");

  // Optional: redirect after 2 seconds
  setTimeout(() => {
    console.log("Redirecting to next page...");
    window.location.href = "next.html"; // change to your next page
  }, 2000);
};