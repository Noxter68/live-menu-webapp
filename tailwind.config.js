/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FDF8F3',
          200: '#F9F1E8',
          300: '#F5E6D3',
          400: '#E8D5BE',
          500: '#D4C4A8',
          600: '#B8A88C',
          700: '#96836A',
          800: '#746452',
          900: '#524539',
        },
        warm: {
          50: '#FDFCFB',
          100: '#F7F5F3',
          200: '#EBE7E4',
          300: '#D6D0CA',
          400: '#B8B0A6',
          500: '#9A9082',
          600: '#7C7164',
          700: '#5E5449',
          800: '#403A32',
          900: '#2D2620',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
