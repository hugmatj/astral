import { defineStore } from 'pinia'
import { Tag, Values } from '@/types'

const BASE_FILTERS = {
  ALL: 'all',
  UNTAGGED: 'untagged',
} as const

type BaseFilter = Values<typeof BASE_FILTERS>

export const useStarsFilterStore = defineStore({
  id: 'stars-filter',
  state() {
    return {
      selectedFilter: BASE_FILTERS.ALL as BaseFilter,
      selectedTag: null as Tag,
      selectedLanguage: null as string,
    }
  },
  getters: {
    isFilteringByAll(): boolean {
      return (
        this.selectedFilter === BASE_FILTERS.ALL &&
        !this.isFilteringByTag &&
        !this.isFilteringByLanguage
      )
    },
    isFilteringByUntagged(): boolean {
      return (
        this.selectedFilter === BASE_FILTERS.UNTAGGED && !this.isFilteringByTag
      )
    },
    isFilteringByTag(): boolean {
      return !!Object.keys(this.selectedTag).length
    },
    isFilteringByLanguage(): boolean {
      return !!this.selectedLanguage
    },
  },
  actions: {
    clearSelectedTag() {
      this.selectedTag = null
    },
    clearSelectedLanguage() {
      this.selectedLanguage = null
    },
    setFilterByAll() {
      this.clearSelectedTag()
      this.clearSelectedLanguage()
      this.selectedFilter = BASE_FILTERS.ALL
    },
    setFilterByUntagged() {
      this.clearSelectedTag()
      this.selectedFilter = BASE_FILTERS.UNTAGGED
    },
  },
})
