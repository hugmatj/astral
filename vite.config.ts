import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    laravel({
      input: ['resources/js/app.ts'],
      valetTls: 'astral.test',
    }),
    svgLoader({ svgo: false }),
  ],
  server: {
    port: 3001,
  },
})
