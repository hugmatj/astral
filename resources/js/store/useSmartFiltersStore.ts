import { defineStore } from 'pinia'
import { Errors, Inertia, Page, PageProps } from '@inertiajs/inertia'
import { SmartFilter } from '@/types'

export const useSmartFiltersStore = defineStore({
  id: 'smart-filters',
  state() {
    return {
      smartFilters: [] as SmartFilter[],
    }
  },
  actions: {
    addSmartFilter(smartFilter: Pick<SmartFilter, 'name' | 'body'>): Promise<Page<PageProps> | Errors> {
      return new Promise((resolve, reject) => {
        Inertia.post('/smart-filters', smartFilter, {
          only: ['smartFilters', 'abilities', 'errors'],
          onSuccess: (page) => {
            resolve(page)
          },
          onError: (errors) => {
            reject(errors)
          },
        })
      })
    },
    updateSmartFilter(id: number, smartFilter: Pick<SmartFilter, 'name' | 'body'>): Promise<Page<PageProps> | Errors> {
      return new Promise((resolve, reject) => {
        Inertia.put(`/smart-filters/${id}`, smartFilter, {
          only: ['smartFilters', 'errors'],
          onSuccess: (page) => {
            resolve(page)
          },
          onError: (errors) => {
            reject(errors)
          },
        })
      })
    },
    deleteSmartFilter(id: number) {
      Inertia.delete(`/smart-filters/${id}`, { only: ['smartFilters', 'abilities'] })
    },
    syncSmartFiltersOrder() {
      const reorderedSmartFilters = this.smartFilters.map((filter, index) => ({
        id: filter.id,
        sort_order: index,
      }))
      Inertia.put('/smart-filters/reorder', { smartFilters: reorderedSmartFilters } as any, { only: ['smartFilters'] })
    },
  },
})
