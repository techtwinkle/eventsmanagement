/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          card: '#111111',
          border: '#1f1f1f',
          text: '#ffffff',
          muted: '#888888',
        },
        blue: {
          primary: '#3b82f6',
          hover: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};