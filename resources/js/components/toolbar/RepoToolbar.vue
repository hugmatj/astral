<template>
  <div class="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-300 bg-gray-50">
    <BaseButton size="sm">
      Edit Notes
    </BaseButton>
    <div class="ml-auto">
      <CloneUrlInput />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '@/components/core/BaseButton.vue'
import CloneUrlInput from '@/components/toolbar/CloneUrlInput.vue'

export default defineComponent({
  components: { BaseButton, CloneUrlInput },
  setup () {

    return {
    }
  }
})
</script>

<style scoped>

</style>
