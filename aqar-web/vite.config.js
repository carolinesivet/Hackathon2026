import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':  'https://aqar-014n.onrender.com',
      '/form': 'https://aqar-014n.onrender.com',
    },
  },
})