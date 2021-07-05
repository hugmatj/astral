<template>
  <div class="p-4 border-b border-gray-300">
    <div class="relative flex items-center py-2 pr-3 transition-colors bg-white border-2 border-gray-300 rounded-md pl-9 focus-within:border-gray-400">
      <input v-model="searchQuery" type="text" class="flex-grow w-full p-0 text-gray-500 placeholder-gray-300 border-none peer focus:ring-0" placeholder="Gaze through your telescope..." />
      <SearchIcon class="absolute w-5 h-5 text-gray-300 transition-colors pointer-events-none left-2 peer-focus:text-gray-400" aria-hidden="true" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { SearchIcon } from '@heroicons/vue/outline'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'

export default defineComponent({
  components: { SearchIcon },
  setup () {
    const starsFilterStore = useStarsFilterStore()

    const searchQuery = computed({
      get() {
        return starsFilterStore.searchQuery
      },
      set(query: string) {
        starsFilterStore.searchQuery = query
      }
    })


    return {
      searchQuery,
    }
  }
})
</script>

<style scoped>

</style>
