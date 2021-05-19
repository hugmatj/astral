import { watch } from 'vue'
import type { Store } from 'pinia'

export const useSyncValueToStore = <
  TStore extends Store,
  TKey extends keyof TStore['$state']
>(
  propGetter: () => TStore[TKey],
  store: TStore,
  key: TKey
): void => {
  watch(
    propGetter,
    propValue => {
      store[key] = propValue
    },
    {
      immediate: true,
    }
  )
}
