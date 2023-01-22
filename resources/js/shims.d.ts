import type { Page } from '@inertiajs/core'
import Types from '@inertiajs/vue3/types/types'

declare module '@inertiajs/vue3' {
  export declare function usePage<T>(): Page<T>
}

declare module 'fuzzysearch' {
  export default function (needle: string, haystack: string): boolean
}

declare module '@heroicons/*'

declare module 'vue-flatpickr-component'

declare module 'particles.vue3'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
