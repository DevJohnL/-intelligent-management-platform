/** @type {import('tailwindcss').Config} */
const { blue } = require("@ant-design/colors")

const antBlue = {
  50: blue[0],
  100: blue[1],
  200: blue[2],
  300: blue[3],
  400: blue[4],
  500: blue[5],
  600: blue[6],
  700: blue[7],
  800: blue[8],
  900: blue[9],
  primary: blue.primary,
}

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: antBlue.primary,
        secondary: antBlue[300],
        card: antBlue[800],
        blue: antBlue,
      },
    },
  },
  plugins: [],
}

