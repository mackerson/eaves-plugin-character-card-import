import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Build plugin UI as a library with external dependencies
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'ui/src/index.tsx'),
      name: 'CharacterCardImportPlugin',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      output: {
        paths: {
          'react': '/node_modules/react',
          'react-dom': '/node_modules/react-dom',
          'react/jsx-runtime': '/node_modules/react/jsx-runtime',
        },
        preserveModules: false,
      },
    },
    outDir: 'ui/dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../src/renderer'),
    },
  },
});
