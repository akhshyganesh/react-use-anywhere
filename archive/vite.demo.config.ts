import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base: './', // Use relative paths for assets
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'lib'),
      '@demo': resolve(__dirname, 'demo'),
    },
  },
  server: {
    port: 3000,
  },
});
