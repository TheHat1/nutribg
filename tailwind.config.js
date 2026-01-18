/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",,
    "./src/App.jsx"
  ],
  theme: {
    extend: {
      screens: {
        "nav": {max: "565px"},
      },
    },
  },
  plugins: [],
};