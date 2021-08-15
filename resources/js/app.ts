import { createApp, h } from 'vue'
// import { App, plugin as inertiaPlugin } from '@inertiajs/inertia-vue3'
import { createInertiaApp } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import { createPinia } from 'pinia'

const el = document.getElementById('app')

if (el) {
  createInertiaApp({
    resolve: name => import(`./Pages/${name}`).then(module => module.default),
    setup({ el, app, props, plugin }) {
      createApp({ render: () => h(app, props) })
      .use(plugin)
      .use(createPinia())
      .mount(el)
    }
  })

  InertiaProgress.init()
}
