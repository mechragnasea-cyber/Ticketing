import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Ticketing/',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7032',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
