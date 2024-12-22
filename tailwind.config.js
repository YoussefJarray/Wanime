/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,tsx}',
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      aspectRatio: {
        'card': '9 / 16',
      },
    }
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};