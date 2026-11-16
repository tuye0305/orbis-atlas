import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE lets the same build run at / locally and at /<repo>/ on GitHub Pages.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
})
