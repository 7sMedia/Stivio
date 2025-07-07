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
        // Backgrounds
        'bg-dark': '#0F1115',
        'bg-light': '#FFFFFF',
        // Surfaces
        'surface-primary': '#1A1C22',
        'surface-secondary': '#2A2D38',
        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A6B0',
        'text-muted': '#6B7280',
        // Accent
        accent: '#00D8FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        base: ['1rem',   { lineHeight: '1.5rem'  }],   // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem'}],    // 18px
        xl: ['1.25rem',  { lineHeight: '1.75rem'}],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem'    }],  // 24px
        '3xl': ['1.875rem',{ lineHeight: '2.25rem'}],  // 30px
      },
      spacing: {
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        4: '1rem',     // 16px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        12: '3rem',    // 48px
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.2)',
        md: '0 4px 8px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        md: '0.375rem', // 6px
        lg: '0.5rem',   // 8px
      },
    },
  },
  plugins: [],
}
