/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('https://www.unfi.com/content/dam/unfi-corporate/homepage/en/hp-services-bring-out-true-value.jpg')"
      }
    },
  },
  plugins: [],
}

