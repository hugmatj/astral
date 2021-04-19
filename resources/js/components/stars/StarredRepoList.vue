<template>
  <ul
    class="col-span-1 row-start-2 row-end-3 overflow-y-auto border-r border-gray-300 divide-y divide-gray-300 sm:col-start-2"
  >
    <!-- Stars List -->
    <li v-for="repo in filteredRepos" :key="repo.node.id">
      <slot :repo="repo" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { useSyncToLocalStorage } from '@/composables/useSyncToLocalStorage'

export default defineComponent({
  setup() {
    /** Stars Fetch Lifecycle
     * 1. fetch using whatever the end cursor is, even if it's null
     * 2. Keep fetching until `hasNextPage` is false.
     * 3. fetch any new repos in ASC order using the first repo's cursor, fetch until `hasNextPage` is false
     **/
    const starsStore = useStarsStore()
    const reposHaveSynced = ref(false)
    const pageInfoHasSynced = ref(false)

    useSyncToLocalStorage(starsStore, 'starredRepos').then(() => {
      reposHaveSynced.value = true
    })
    useSyncToLocalStorage(starsStore, 'pageInfo').then(() => {
      pageInfoHasSynced.value = true
    })

    watch([reposHaveSynced, pageInfoHasSynced], async newValues => {
      if (newValues.every(Boolean)) {
        await nextTick()
        starsStore.fetchStars(starsStore.pageInfo.endCursor)
      }
    })

    starsStore.worker.onmessage = ({ data }) => {
      const { starredRepositories } = data.viewer

      starsStore.totalRepos = starredRepositories.totalCount
      starsStore.pageInfo = starredRepositories.pageInfo

      starsStore.starredRepos = starsStore.allStars.concat(
        starredRepositories.edges
      )
      // if (starsStore.pageInfo.hasNextPage) {
      //   starsStore.fetchStars(starsStore.pageInfo.endCursor)
      // }
    }

    return {
      filteredRepos: computed(() => starsStore.filteredRepos),
    }
  },
})
</script>
