import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE per GitHub Pages: base = nome repo
export default defineConfig({
  plugins: [react()],
  base: '/FlipHelper/'
})
