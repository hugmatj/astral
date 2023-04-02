import { createApp, h, DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createPinia } from 'pinia'
import '../css/app.css'

createInertiaApp({
  resolve: name =>
    resolvePageComponent(
      `../views/pages/${name}.vue`,
      import.meta.glob('../views/pages/**/*.vue')
    ) as Promise<DefineComponent>,
  setup({ el, App, props, plugin }) {
    //eslint-disable-next-line vue/component-api-style
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(createPinia())
      .mount(el)
  },
  progress: false,
})
