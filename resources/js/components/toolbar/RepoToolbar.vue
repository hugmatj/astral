<template>
  <div class="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-300 bg-gray-50">
    <BaseButton size="sm" @click="toggleNotesEditor()">
      {{ isNotesEditorOpen ? 'Hide' : 'Show' }} Notes
    </BaseButton>
    <div class="ml-auto">
      <CloneUrlInput />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/shared/core/BaseButton.vue'
import CloneUrlInput from '@/components/toolbar/CloneUrlInput.vue'
import { useNotesEditor } from '@/composables/useNotesEditor'

const { isOpen: isNotesEditorOpen, toggle: toggleNotesEditor } = useNotesEditor()
</script>
