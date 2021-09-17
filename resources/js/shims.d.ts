/* eslint-disable */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-virtual-scroller'

declare module 'fuzzysearch' {
  export default function(needle: string, haystack: string): boolean
}

declare module '@heroicons/*'
