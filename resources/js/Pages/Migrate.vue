<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { useSyncToLocalStorage } from '@/composables/useSyncToLocalStorage'
import { User, UserStar } from '@/types'
import LogoSvg from '@/../img/logo.svg?component'
import MigrateAstronautSvg from '@/../img/migrate-waving-astronaut.svg?component'
import { useUserStore } from '@/store/useUserStore'
import { useSyncValuesToStores } from '@/composables/useSyncValuesToStores'

// This page is a one-off, just do everything here
const props = defineProps<{
  stars: UserStar[]
  user: User
}>()

const starsStore = useStarsStore()
const userStore = useUserStore()

const reposHaveSynced = ref(false)
const pageInfoHasSynced = ref(false)

const isReadyToBeginMigration = ref(true)

useSyncValuesToStores(
  [userStore, 'user', computed(() => props.user)],
  [starsStore, 'userStars', computed(() => props.stars)]
)

useSyncToLocalStorage(starsStore, 'starredRepos').then(() => {
  reposHaveSynced.value = true
})
useSyncToLocalStorage(starsStore, 'pageInfo').then(() => {
  pageInfoHasSynced.value = true
})

watch([reposHaveSynced, pageInfoHasSynced], async syncChecks => {
  if (syncChecks.every(Boolean) && starsStore.pageInfo.hasNextPage) {
    // We're ready to start fetching stars
    await nextTick()
    isReadyToBeginMigration.value = true
  }
})

const beginMigration = () => {
  starsStore.fetchStars(starsStore.pageInfo.endCursor)
}

// starsStore.worker.onmessage = ({ data }) => {
//   const { starredRepositories } = data.viewer

//   starsStore.totalRepos = starredRepositories.totalCount
//   starsStore.pageInfo = starredRepositories.pageInfo

//   starsStore.starredRepos = starsStore.starredRepos.concat(starredRepositories.edges)
//   if (starsStore.pageInfo.hasNextPage) {
//     starsStore.fetchStars(starsStore.pageInfo.endCursor)
//   }
// }
</script>

<template>
  <div
    class="fixed inset-0 flex items-center bg-gray-900 bg-[length:1000px_1000px] bg-repeat"
    :style="{ backgroundImage: 'url(/img/migrate-bg.svg)' }"
  >
    <div class="mx-auto flex w-full max-w-screen-lg justify-between">
      <MigrateAstronautSvg class="h-auto w-full max-w-xs motion-safe:animate-float" aria-hidden="true" />

      <div class="space-y-8 pl-24">
        <h2 class="bg-gray-900 text-6xl font-bold leading-tight text-white shadow-[0_0_10px_10px_#111827]">
          Welcome to the<br />
          new
          <LogoSvg class="px relative -top-1 inline-flex h-6 fill-current text-brand-500 sm:h-12" aria-label="Astral" />
        </h2>

        <p class="bg-gray-900 leading-loose text-white shadow-[0_0_10px_10px_#111827]">
          Before you get started we need to migrate some of your data to the new version. Depending on the number of
          stars you have, this could take from a few seconds to a couple minutes.
        </p>

        <div>
          <button
            type="button"
            :disabled="!isReadyToBeginMigration"
            class="relative rounded-full bg-brand-600 px-6 py-4 text-2xl font-bold text-white shadow-lg shadow-brand-900 transition-all hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-800 active:top-px disabled:pointer-events-none disabled:opacity-50"
            @click="beginMigration"
          >
            Begin Migration
          </button>
        </div>

        <div>
          <ul>
            <li v-if="starsStore.totalRepos > 0" class="text-white">
              Fetching stars: {{ starsStore.allStars.length }} / {{ starsStore.totalRepos }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
