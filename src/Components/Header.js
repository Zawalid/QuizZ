import React, { useState } from "react";
import { ReactComponent as SunIcon } from "../Assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../Assets/icons/moon.svg";
import { ReactComponent as SettingsIcon } from "../Assets/icons/settings.svg";

// Header
export function Header({ children }) {
  const [theme, setTheme] = useState(localStorage.theme || "light");
  function toggleTheme() {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    setTheme((th) => (th === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  }
  return (
    <header className="relative z-20 flex items-center justify-between">
      <img src="/Logo-192.png" alt="QuizZ" className="h-20 w-20" />
      <div className="flex gap-5">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { theme }),
        )}
        <ThemeSwitcher theme={theme} onclick={toggleTheme} />
      </div>
    </header>
  );
}
function ThemeSwitcher({ theme, onclick }) {
  return (
    <button className=" cursor-pointer " onClick={onclick}>
      {theme === "light" ? <MoonIcon fill="#333" /> : <SunIcon fill="#fff" />}
    </button>
  );
}
export function SettingsButton({ isSettingsOpen, onToggleSettings, theme }) {
  return (
    <button className=" cursor-pointer " onClick={onToggleSettings}>
      {theme === "light" ? (
        <SettingsIcon fill={isSettingsOpen ? "#9C27B0" : "#333"} />
      ) : (
        <SettingsIcon fill={isSettingsOpen ? "#9C27B0" : "#fff"} />
      )}
    </button>
  );
}
