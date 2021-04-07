import { createApp, h } from 'vue'
import { App, plugin as inertiaPlugin } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import { createPinia } from 'pinia'

const el = document.getElementById('app')

createApp({
  render: () =>
    h(App, {
      initialPage: JSON.parse(el.dataset.page),
      resolveComponent: name =>
        import(`./Pages/${name}`).then(module => module.default),
    }),
})
  .use(createPinia())
  .use(inertiaPlugin)
  .mount(el)

InertiaProgress.init()
