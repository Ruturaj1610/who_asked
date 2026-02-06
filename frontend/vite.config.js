import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Base path for deployment
    // Netlify serves from root, so use '/'
    base: '/',
    server: {
        port: 3000,
        host: true // Expose to network
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        // Optimize build
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    socket: ['socket.io-client']
                }
            }
        }
    }
})
