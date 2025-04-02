import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows access from other devices on the network
    port: 5173, // Default port
    strictPort: true, // Ensures it doesn’t switch ports
    https: false, // ✅ Ensures the app runs on HTTP (prevents secure context issues)
    cors: true, // ✅ Allows cross-origin requests
  },
})
