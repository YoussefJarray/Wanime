import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-anime-rouge.vercel.app', // Target API
        changeOrigin: true, // Ensures the host header is adjusted
        rewrite: (path) => path.replace(/^\/api/, ''), // Strips "/api" from the proxied request
      },
    },
  },
});
