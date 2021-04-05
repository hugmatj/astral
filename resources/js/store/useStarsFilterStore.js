import { defineStore } from 'pinia'

export const BASE_FILTERS = {
  ALL: 'all',
  UNTAGGED: 'untagged',
}

export const useStarsFilterStore = defineStore({
  id: 'stars-filter',
  state() {
    return {
      selectedFilter: BASE_FILTERS.ALL,
      selectedTag: {},
      selectedLanguage: null,
    }
  },
  getters: {
    isFilteringByAll() {
      return (
        this.selectedFilter === BASE_FILTERS.ALL &&
        !this.isFilteringByTag &&
        !this.isFilteringByLanguage
      )
    },
    isFilteringByUntagged() {
      return (
        this.selectedFilter === BASE_FILTERS.UNTAGGED && !this.isFilteringByTag
      )
    },
    isFilteringByTag() {
      return !!Object.keys(this.selectedTag).length
    },
    isFilteringByLanguage() {
      return !!this.selectedLanguage
    },
  },
  actions: {
    clearSelectedTag() {
      this.selectedTag = {}
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
