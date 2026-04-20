import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for GitHub Pages: https://londonconsultingmx.github.io/sumimsacapitalhumanocompensacion/
export default defineConfig({
  plugins: [react()],
  base: '/sumimsacapitalhumanocompensacion/',
})
