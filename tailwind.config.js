/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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