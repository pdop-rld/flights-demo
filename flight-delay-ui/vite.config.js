import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
         proxy: {
           '/api': { // This is the path you'll use in your frontend requests
             target: 'http://localhost:5000', // Replace with your backend's URL
             changeOrigin: true, // This is crucial for some setups
             secure: false, // If your backend uses HTTPS, set to true
             rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove the /api prefix
           },
         },
        }
})
