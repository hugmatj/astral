import { watch, readonly } from 'vue'

export const useSyncPropToStore = (propGetter, store, state) => {
  watch(
    propGetter,
    propValue => {
      store[state] = propValue
    },
    {
      immediate: true,
    }
  )
}
