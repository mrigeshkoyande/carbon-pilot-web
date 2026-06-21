/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/firestore')) {
            return 'firebase-firestore';
          }
          if (id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth';
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-core';
          }
          if (id.includes('node_modules/@sentry')) {
            return 'sentry';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
        }
      }
    }
  }
})
