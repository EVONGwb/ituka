/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ituka-cream': '#FAF7F0', // Base claro cálido
        'ituka-cream-soft': '#F9F7F2',
        'ituka-cream-deep': '#EBE5CE',
        'ituka-surface': '#FFFFFF',
        'ituka-border': '#E9E2D6',
        'ituka-green': '#556B2F', // Olive Green
        'ituka-gold': '#C9A227', // Gold
        'ituka-gold-highlight': '#E7D08A',
        'ituka-gold-shadow': '#B88A1E',
        'ituka-ink': '#3E2723',
        'ituka-ink-muted': '#5D4037',
        'ituka-text': '#1F1F1F',
        'ituka-muted': '#5A5A5A',
        'ituka-success': '#6FA387',
        'ituka-success-soft': '#EAF4EF',
        'ituka-warning': '#D2A15A',
        'ituka-warning-soft': '#FBF1E3',
        'ituka-danger': '#C97A7A',
        'ituka-danger-soft': '#F8EAEA',
        'ituka-info': '#78A6C8',
        'ituka-info-soft': '#EAF2FA',
      },
      borderRadius: {
        'ituka-card': '24px',
        'ituka-panel': '32px',
        'ituka-pill': '9999px',
      },
      boxShadow: {
        'ituka-card': '0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.04)',
        'ituka-float': '0 2px 8px rgba(0,0,0,0.06), 0 18px 48px rgba(0,0,0,0.08)',
        'ituka-inset': 'inset 0 1px 0 rgba(255,255,255,0.75)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
