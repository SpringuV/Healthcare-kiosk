/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",          // File HTML chính
    "./src/**/*.{js,ts,jsx,tsx}" // Nếu có JS trong src
  ],
  theme: {
    extend: {
      fontFamily: {

      },
      colors: {
        'colorOne': '#006e66',
        'colorBody': '#e5e7eb',
        'colorTwo': '#60b062',
        'colorFour': '#00b004',
        'colorFive': '#007a03'
      }
    },
  },
  plugins: [],
}

