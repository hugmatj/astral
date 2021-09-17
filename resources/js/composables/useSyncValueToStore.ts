import { watch, ComputedRef } from 'vue'
import { Store } from 'pinia'

export const useSyncValueToStore = <
  TStore extends Store,
  TKey extends keyof TStore['$state']
>(
  propGetter: ComputedRef<TStore[TKey]>,
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
