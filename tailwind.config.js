/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  purge: {
    enabled: true, 
    content: ["./src/**/*.{js,ts,jsx,tsx}"], 
  },
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