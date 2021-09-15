import { defineConfig } from 'laravel-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig()
  .withValetCertificates({ domain: 'astral.test' })
	.withPlugin(vue)
	.merge({
	})
