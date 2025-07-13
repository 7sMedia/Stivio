/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Core
        primary: '#7F00FF',        // Electric Violet
        secondary: '#FF2DCB',      // Vivid Pink
        accent: '#00CFFF',         // Neon Blue
        background: '#0D0D0D',     // Main app background
        // Original Design Tokens (preserved)
        'bg-dark': '#0F1115',
        'bg-light': '#FFFFFF',
        'surface-primary': '#1A1C22',
        'surface-secondary': '#2A2D38',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A6B0',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.2)',
        md: '0 4px 8px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
      },
    },
  },
  plugins: [],
}
