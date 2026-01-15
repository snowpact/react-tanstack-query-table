import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  base: '/react-tanstack-query-table/',
  build: {
    outDir: resolve(__dirname, '../demo-dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@snowpact/react-tanstack-query-table': resolve(__dirname, '../src'),
    },
  },
});
