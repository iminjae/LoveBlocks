/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'toss-blue': '#0064FF',
        'toss-dark': '#1E1E1E',
        'toss-light': '#F9F9F9',
        'toss-gray': '#888888',
        'c-silver': '#C0C0C0',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        fadeInMove: 'fadeInMove 1.5s ease-out forwards',
      },
      keyframes: {
        fadeInMove: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}