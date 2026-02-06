import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Set base path for GitHub Pages deployment
    // For repo named 'who_asked', the base will be '/who_asked/'
    // Change this to '/' if deploying to a custom domain
    base: process.env.NODE_ENV === 'production' ? '/who_asked/' : '/',
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
