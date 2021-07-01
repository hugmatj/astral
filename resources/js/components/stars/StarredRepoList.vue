<template>
  <DynamicScroller
    v-if="filteredRepos.length"
    :items="filteredRepos"
    :min-item-size="168"
    key-field="cursor"
    class="relative h-full col-span-1 row-start-2 row-end-3 bg-white sm:col-start-2"
    role="listbox"
    aria-label="Stars List"
    aria-multiselectable="true"
  >
    <template #default="{ item: repo, active }">
      <DynamicScrollerItem
        :item="repo"
        :active="active"
        class="relative border-b border-gray-300 dark:border-gray-600"
      >
        <slot :repo="repo" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <div v-else class="flex items-center justify-center h-full">
    <p class="text-center text-gray-500">No results found</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { useAuthorizationsStore } from '@/store/useAuthorizationsStore'
import { useSyncToLocalStorage } from '@/composables/useSyncToLocalStorage'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default defineComponent({
  components: {
    DynamicScroller,
    DynamicScrollerItem,
  },
  setup() {
    /** Stars Fetch Lifecycle
     * 1. if hasNextPage is true, fetch using whatever the end cursor is, even if it's null
     * 2. Keep fetching until `hasNextPage` is false.
     * 3. fetch any new repos in ASC order using the first repo's cursor, fetch until `hasNextPage` is false
     **/
    const starsStore = useStarsStore()
    const authorizationsStore = useAuthorizationsStore()
    const reposHaveSynced = ref(false)
    const pageInfoHasSynced = ref(false)

    useSyncToLocalStorage(starsStore, 'starredRepos').then(() => {
      reposHaveSynced.value = true
    })
    useSyncToLocalStorage(starsStore, 'pageInfo').then(() => {
      pageInfoHasSynced.value = true
    })

    watch([reposHaveSynced, pageInfoHasSynced], async newValues => {
      if (newValues.every(Boolean) && starsStore.pageInfo.hasNextPage) {
        await nextTick()
        // starsStore.fetchStars(starsStore.pageInfo.endCursor)
      }
    })

    starsStore.worker.onmessage = ({ data }) => {
      const { starredRepositories } = data.viewer

      starsStore.totalRepos = starredRepositories.totalCount
      starsStore.pageInfo = starredRepositories.pageInfo

      starsStore.starredRepos = starsStore.allStars.concat(
        starredRepositories.edges
      )
      if (starsStore.pageInfo.hasNextPage) {
        // starsStore.fetchStars(starsStore.pageInfo.endCursor)
      } else {
        authorizationsStore.checkForSponsorship()
      }


    }

    return {
      filteredRepos: computed(() => starsStore.filteredRepos),
    }
  },
})
</script>
