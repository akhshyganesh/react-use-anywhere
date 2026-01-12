import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-use-anywhere': path.resolve(__dirname, '../../lib/index.ts'),
    },
  },
});
