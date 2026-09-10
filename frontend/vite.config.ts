import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/',
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    origin: 'http://localhost:5173',
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
  build: {
    manifest: true,
    outDir: '../backend/static',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
})
