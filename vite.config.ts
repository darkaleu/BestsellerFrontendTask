import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'ssr-full-reload',
      handleHotUpdate({ file, server }) {
        if (file.includes('src') || file.endsWith('data.json') || file.endsWith('index.html')) {
          server.ws.send({ type: 'full-reload' })
          return []
        }
      },
    },
  ],
})
