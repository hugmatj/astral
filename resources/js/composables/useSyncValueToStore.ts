import { watch } from 'vue'
import { StoreInstance } from '@/types'

export const useSyncValueToStore = <
  TStore extends StoreInstance,
  TKey extends keyof TStore
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
