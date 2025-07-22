/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {

      },
      colors: {
        'colorOne': '#006e66',
        'colorBody': '#e5e7eb',
        'colorTwo': '#60b062',
        'colorFour': '#00b004',
        'colorFive': '#007a03',
        'colorOneDark': '#00433e',
        'colorOneLight': '#009e93',
        'colorOneLighter': '#33c2b8',
        'colorOneSoft': '#ccf1ee',
      }
    },
  },
  plugins: [],
};
