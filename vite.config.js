import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Netlify dev server port (must match netlify.toml [dev] port)
const NETLIFY_PORT = process.env.NETLIFY_DEV_PORT || 9999

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true, // Fail if 3000 is busy instead of picking another port
    proxy: {
      // Proxy Netlify function calls to the Netlify dev server
      '/.netlify/functions': {
        target: `http://localhost:${NETLIFY_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
