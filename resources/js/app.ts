import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/inertia-vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createPinia } from 'pinia'
import '@/../css/app.css'

const el = document.getElementById('app')
const pages = import.meta.glob('./Pages/**/*.vue')

if (el) {
  createInertiaApp({
    resolve: name => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, app, props, plugin }) {
      createApp({ render: () => h(app, props) })
        .use(plugin)
        .use(createPinia())
        .mount(el)
    },
  })
}
