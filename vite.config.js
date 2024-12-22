import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  build: {
    outDir: 'dist', // Ensure this is where you want your build output
    assetsDir: 'assets', // This should match how Vercel handles your static assets
  },
  plugins: [react()],
  base: "/wanime/",
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
