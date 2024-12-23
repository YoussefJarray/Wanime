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
    require('tailwindcss')({
      // Ensure the generated CSS is compatible with Vercel
      purge: {
        content: ['./*.html', './src/**/*.{js,jsx,ts,tsx}', "./Components/**/*.{js,ts,jsx,tsx}"],
        options: {
          safelist: [], // Add any classes you want to keep
        },
      },
    }),
    require('autoprefixer'),
  ],
};