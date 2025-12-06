/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        gaba: {
          primary: '#4E56C0',
          secondary: '#9B5DE0',
          tertiary: '#D78FEE',
          light: '#FDCFFA'
        }
      }
    },
  },
  plugins: [],
}
