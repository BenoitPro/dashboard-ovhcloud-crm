import { defineConfig } from 'vite'

export default defineConfig({
  // Use relative paths in the build output (safest for Vercel/GitHub Pages)
  base: './',
  build: {
    outDir: 'dist',
  }
})
