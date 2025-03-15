import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite accesul din rețea locală
    port: 5173,
  },
  proxy: {
    '/api': {
      target: 'http://backend:5000', // Numele serviciului din docker-compose
      changeOrigin: true,
      secure: false
    }
  }
})
