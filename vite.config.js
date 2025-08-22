// vite.config.js
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Root-domain hosting (Hostinger, Netlify, etc.)
  // Use relative asset paths so built files resolve correctly from /
  base: './',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
  },

  server: {
    // Dev server niceties; ignored in production build
    open: true,
    cors: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096, // inline small assets as base64
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // sensible vendor/code-splitting defaults
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },

  // Keep modern targets; adjust if you need legacy browser support
  esbuild: {
    legalComments: 'none',
  },
});
