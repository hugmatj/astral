import { defineStore } from 'pinia'
import { Tag } from '@/types'

const BASE_FILTERS = {
  ALL: 'all',
  UNTAGGED: 'untagged',
} as const

interface SearchInput {
  query: string,
  tags: string[],
  strings: string[],
}

type BaseFilter = Values<typeof BASE_FILTERS>

export const useStarsFilterStore = defineStore({
  id: 'stars-filter',
  state() {
    return {
      selectedFilter: BASE_FILTERS.ALL as BaseFilter,
      selectedTag: null as Nullable<Tag>,
      selectedLanguage: null as Nullable<string>,
      searchQuery: ""
    }
  },
  getters: {
    search(): SearchInput {
      const queryParts = this.searchQuery
        .trim()
        .toLowerCase()
        .split(':')
      const tags = queryParts.filter(part => part.startsWith('#')).map(tag => tag.substring(1))
      const strings = queryParts.filter(part => !part.startsWith('#'))

      return {
        query: this.searchQuery,
        tags,
        strings,
      }
    },
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
      return !!this.selectedTag && !!Object.keys(this.selectedTag).length
    },
    isFilteringByLanguage(): boolean {
      return !!this.selectedLanguage
    },
    isFilteringBySearch(): boolean {
      return !!this.searchQuery
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
