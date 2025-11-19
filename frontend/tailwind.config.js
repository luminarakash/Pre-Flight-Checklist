/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand1: "#0ea5a4", // teal-ish
        brand2: "#6366f1"  // indigo
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#0ea5a4 0%, #6366f1 100%)'
      }
    },
  },
  plugins: [],
}
