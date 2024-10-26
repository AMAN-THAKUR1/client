import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // This makes the server accessible to your network
    port: 5173,    // You can change this port if needed
  }
})