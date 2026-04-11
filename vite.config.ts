import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'https://api-framework-dev.azure-api.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
