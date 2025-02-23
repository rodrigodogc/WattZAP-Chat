import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/WattZAP-Chat",
  server: {
    host: '0.0.0.0'
  },
})
