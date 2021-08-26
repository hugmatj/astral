<template>
  <div class="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-300">
    <div class="relative flex items-center w-full py-2 transition-colors bg-white border border-transparent rounded-md shadow ring-gray-300 ring-1 focus-within:border-gray-400 focus-within:ring-gray-400">
      <input ref="input" v-model="searchQuery" type="text" class="flex-grow w-full py-0 pr-3 text-gray-500 placeholder-gray-300 border-none pl-9 peer focus:ring-0" placeholder="Gaze through your telescope..." aria-keyshortcuts="/" />
      <SearchIcon class="absolute w-5 h-5 text-gray-300 transition-colors pointer-events-none left-2 peer-focus:text-gray-400" aria-hidden="true" />
      <span class="absolute px-2 py-1 text-xs font-bold text-gray-300 transition-opacity border border-gray-300 rounded-sm pointer-events-none bg-gray-50 right-2 peer-focus:opacity-0">/</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { SearchIcon } from '@heroicons/vue/outline'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import { onKeyStroke } from '@vueuse/core'
import { isFocusedElementEditable } from '@/utils'

export default defineComponent({
  components: { SearchIcon },
  setup () {
    const starsFilterStore = useStarsFilterStore()

    const input = ref<HTMLInputElement>()
    const searchQuery = computed({
      get() {
        return starsFilterStore.searchQuery
      },
      set(query: string) {
        starsFilterStore.searchQuery = query
      }
    })

    onKeyStroke('/', (e) => {
      if (!isFocusedElementEditable() && document.activeElement !== input.value) {
        e.preventDefault()
        input.value?.focus()
      }
    })

    return {
      input,
      searchQuery,
    }
  }
})
</script>

<style scoped>

</style>
