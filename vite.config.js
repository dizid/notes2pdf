import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Netlify dev server port (must match netlify.toml [dev] port)
const NETLIFY_PORT = process.env.NETLIFY_DEV_PORT || 8888

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true, // Fail if 5173 is busy instead of picking another port
    proxy: {
      // Proxy Netlify function calls to the Netlify dev server
      '/.netlify/functions': {
        target: `http://localhost:${NETLIFY_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
