/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#14b8a6",
        card: "#0f172a",
      },
    },
  },
  plugins: [],
}

