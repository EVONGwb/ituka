/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ituka-cream': '#F5F5DC', // Beige/Cream base
        'ituka-green': '#556B2F', // Olive Green
        'ituka-gold': '#D4AF37', // Gold
        'ituka-text': '#3E2723', // Dark Brown text
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
