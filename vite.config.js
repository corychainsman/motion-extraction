import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/motion-extraction/' : '/',
  build: {
    outDir: '.',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        entryFileNames: 'script.js',
        chunkFileNames: 'script.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})