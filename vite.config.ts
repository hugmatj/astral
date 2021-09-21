import { defineConfig } from 'laravel-vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig()
  // .withValetCertificates({ domain: 'astral.test' })
  .withPlugins(vue, mkcert())
  .merge({
    server: {
      https: true,
    },
  })
