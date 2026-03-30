/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Deep Charcoal/Navy
        secondary: '#F2CC0D', // Premium Gold
        accent: '#D4AF37', // Soft Gold
        background: '#020617', // Deepest Navy (Dark Mode Base)
        surface: 'rgba(30, 41, 59, 0.7)', // Glassmorphic Surface
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Body
        outfit: ['Outfit', 'sans-serif'], // Headings & Premium UI
      }
    },
  },
  plugins: [],
}
