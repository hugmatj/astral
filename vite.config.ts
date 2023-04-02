import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/resources',
    },
  },
  plugins: [
    vue({
      reactivityTransform: false,
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    laravel({
      input: ['resources/scripts/app.ts'],
      valetTls: 'astral.test',
    }),
    svgLoader({ svgo: false }),
  ],
  server: {
    port: 3001,
  },
})
