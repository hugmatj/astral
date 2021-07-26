<template>
  <div class="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-300 bg-gray-50">
    <button type="button" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
      Edit Notes
    </button>
    <div class="ml-auto">
      <CloneUrlInput />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CloneUrlInput from '@/components/toolbar/CloneUrlInput.vue'

export default defineComponent({
  components: { CloneUrlInput },
  setup () {

    return {
    }
  }
})
</script>

<style scoped>

</style>
