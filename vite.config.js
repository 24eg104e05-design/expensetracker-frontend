import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // apple/tailwind-v4.css imports the bare specifier "tailwindcss", but it
      // lives outside this project so Node would otherwise look for a
      // node_modules above the repo root. Point it at this project's copy.
      {
        find: /^tailwindcss$/,
        replacement: fileURLToPath(new URL('./node_modules/tailwindcss/index.css', import.meta.url)),
      },
    ],
  },
  // The Apple design tokens live at <repo>/apple and are imported from
  // src/index.css, so Vite must be allowed to read outside the project root.
  server: {
    port: 5173,
    fs: {
      allow: ['..'],
    },
    proxy: {
      // Dev proxy keeps the browser same-origin, so CORS never blocks development.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})