/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#9C27B0",
        // Light Theme
        "light-background": "#FFFFFF",
        "light-secondary": "#E0E0E0",
        "light-text": "#333333",
        "light-text-2": "#777777",
        "light-correct": "#66BB6A",
        "light-incorrect": "#FF5733",
        // Dark Theme
        "dark-background": "#121212",
        "dark-secondary": "#333333",
        "dark-text": "#FFFFFF",
        "dark-text-2": "#AAAAAA",
        "dark-correct": "#008000",
        "dark-incorrect": "#FF0000",
      },
      animation: {
        "bounce-200": "bounce 1s infinite 200ms",
        "bounce-400": "bounce 1s infinite 400ms",
      },
    },
  },
  plugins: [],
};
