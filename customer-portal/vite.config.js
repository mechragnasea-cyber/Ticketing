import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Ticketing/customer-portal/',
  plugins: [vue()],
  root: '.',
})
