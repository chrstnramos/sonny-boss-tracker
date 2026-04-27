/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-amber': 'glow-amber 2s ease-in-out infinite alternate',
        'count-up': 'count-up 0.6s ease-out',
      },
      keyframes: {
        'glow-amber': {
          from: { boxShadow: '0 0 8px #f59e0b66' },
          to: { boxShadow: '0 0 20px #f59e0baa, 0 0 40px #f59e0b44' },
        },
      },
    },
  },
  plugins: [],
}
