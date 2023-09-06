import React from "react";
import { createRoot } from "react-dom/client";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

import "./index.css";
import App from "./Components/App";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const root = createRoot(document.getElementById("root"));
root.render(
    <App />
);

// Theme Switcher
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  localStorage.theme = "dark";
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
