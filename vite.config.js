import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // apple/tailwind-v4.css imports the bare specifier "tailwindcss". Point it
      // at this project's copy so resolution never depends on a node_modules
      // above the repo root (the Railway build only clones this repo).
      {
        find: /^tailwindcss$/,
        replacement: fileURLToPath(new URL('./node_modules/tailwindcss/index.css', import.meta.url)),
      },
    ],
  },
  // The Apple design tokens are vendored at ./apple (imported from
  // src/index.css), so everything the build reads lives inside the project root.
  server: {
    port: 5173,
    proxy: {
      // Dev proxy keeps the browser same-origin, so CORS never blocks development.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})