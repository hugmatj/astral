import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'vite-plugin-laravel'
import mkcert from 'vite-plugin-mkcert'
import svgLoader from 'vite-svg-loader'
import * as path from 'path'

export default defineConfig({
  plugins: [vue(), laravel(), mkcert(), svgLoader({ svgo: false })],
  server: {
    https: true,
    strictPort: true,
    port: 3001,
  },
})
