import { watch, ComputedRef } from 'vue'
import { Store } from 'pinia'

type SyncTuple<TStore extends Store, TKey extends keyof TStore['$state']> = [TStore, TKey, ComputedRef<TStore[TKey]>]

type MappedSyncTuples<T extends any[]> = {
  [K in keyof T]: T[K] extends Store ? SyncTuple<T[K], keyof T[K]['$state']> : never
}

export const useSyncValuesToStores = <T extends any[]>(...mappings: MappedSyncTuples<T>): void => {
  mappings.forEach(([store, key, propGetter]) => {
    watch(
      propGetter,
      (propValue) => {
        store[key] = propValue
      },
      {
        immediate: true,
      }
    )
  })
}
