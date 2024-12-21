/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
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
  ],
};