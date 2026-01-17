import path from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import postcss from 'postcss';
import cssnano from 'cssnano';

// Plugin to process and minify CSS file
const processStyles = () => ({
  name: 'process-styles',
  async closeBundle() {
    const distDir = path.resolve(__dirname, 'dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    const cssPath = path.resolve(__dirname, 'src/styles/index.css');
    const css = readFileSync(cssPath, 'utf-8');

    const result = await postcss([cssnano()]).process(css, { from: cssPath });

    writeFileSync(path.resolve(distDir, 'styles.css'), result.css);
  },
});

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    processStyles(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SnowTable',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-table', '@tanstack/react-query'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tanstack/react-table': 'ReactTable',
          '@tanstack/react-query': 'ReactQuery',
        },
      },
    },
    sourcemap: true,
  },
});
