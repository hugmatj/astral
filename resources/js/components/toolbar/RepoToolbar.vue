<template>
  <div class="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-300 bg-gray-50">
    <BaseButton size="sm" @click="handleToggleNotesEditor()">
      <component :is="currentStarHasNotes ? ExistingNoteIcon : EmptyNoteIcon" class="h-4 -ml-2" />
      <span class="ml-0.5">{{ isNotesEditorOpen ? 'Hide' : 'Show' }} Notes</span>
    </BaseButton>
    <div class="ml-auto">
      <CloneUrlInput />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import CloneUrlInput from '@/components/toolbar/CloneUrlInput.vue'
import { useAuthorizationsStore } from '@/store/useAuthorizationsStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useSponsorshipDialog } from '@/composables/useSponsorshipDialog'
import { useNotesEditor } from '@/composables/useNotesEditor'
import EmptyNoteIcon from '@/components/shared/icons/notes-editor/EmptyNoteIcon.vue'
import ExistingNoteIcon from '@/components/shared/icons/notes-editor/ExistingNoteIcon.vue'
import { ABILITY_CONTEXTS } from '@/constants'
import { onKeyStroke } from '@vueuse/core'
import { isFocusedElementEditable } from '@/utils'

const starsStore = useStarsStore()
const { isOpen: isNotesEditorOpen, toggle: toggleNotesEditor } = useNotesEditor()
const authorizationsStore = useAuthorizationsStore()
const { showDialog: showSponsorshipDialog } = useSponsorshipDialog()

// TODO: Should this just be a getter in the store?
const currentStarHasNotes = computed(() => !!starsStore.userStarsByRepoId[starsStore.selectedRepo.databaseId].notes)

const handleToggleNotesEditor = () => {
  if (authorizationsStore.abilities[ABILITY_CONTEXTS.ADD_NOTES]) {
    toggleNotesEditor()
  } else {
    showSponsorshipDialog(ABILITY_CONTEXTS.ADD_NOTES)
  }
}

onKeyStroke('n', (e) => {
  if (!isFocusedElementEditable()) {
    e.preventDefault()
    handleToggleNotesEditor()
  }
})
</script>
