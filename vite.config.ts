import { defineConfig } from 'laravel-vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import svgLoader from 'vite-svg-loader'

export default defineConfig()
  // .withValetCertificates({ domain: 'astral.test' })
  .withPlugins(vue, mkcert(), svgLoader({ svgo: false }))
  .merge({
    server: {
      https: true,
      strictPort: true,
      port: 3001,
    },
  })
