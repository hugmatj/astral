<template>
  <div
    class="flex h-16 flex-shrink-0 items-center border-b border-gray-300 bg-gray-50 px-4 dark:border-gray-600 dark:bg-gray-800"
  >
    <BaseButton size="sm" @click="handleToggleNotesEditor()">
      <component :is="currentStarHasNotes ? ExistingNoteIcon : EmptyNoteIcon" class="-ml-2 h-4" />
      <span class="ml-0.5">{{ isNotesEditorOpen ? 'Hide' : 'Show' }} Notes</span>
    </BaseButton>
    <BaseButton size="sm" class="ml-2" @click="removeSelectedStar">
      <StarIcon class="-ml-1 h-4" />
      <span class="ml-1">Unstar</span>
    </BaseButton>
    <div class="ml-auto flex-shrink-0">
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
import { useUserStore } from '@/store/useUserStore'
import { useSponsorshipDialog } from '@/composables/useSponsorshipDialog'
import { useUpgradeAuthScopeDialog } from '@/composables/useUpgradeAuthScopeDialog'
import { useConfirm } from '@/composables/useConfirm'
import { useNotesEditor } from '@/composables/useNotesEditor'
import EmptyNoteIcon from '@/components/shared/icons/notes-editor/EmptyNoteIcon.vue'
import ExistingNoteIcon from '@/components/shared/icons/notes-editor/ExistingNoteIcon.vue'
import { StarIcon } from '@heroicons/vue/outline'
import { onKeyStroke } from '@vueuse/core'
import { isFocusedElementEditable } from '@/utils'
import { Ability, AuthScope } from '@/types'

const starsStore = useStarsStore()
const userStore = useUserStore()
const { isOpen: isNotesEditorOpen, toggle: toggleNotesEditor } = useNotesEditor()
const authorizationsStore = useAuthorizationsStore()
const { show: showSponsorshipDialog } = useSponsorshipDialog()
const { show: showUpgradeAuthScopeDialog } = useUpgradeAuthScopeDialog()
const { isConfirmed } = useConfirm()

// TODO: Should this just be a getter in the store?
const currentStarHasNotes = computed(() => !!starsStore.userStarsByRepoId[starsStore.selectedRepo.databaseId]?.notes)

const handleToggleNotesEditor = () => {
  if (authorizationsStore.abilities[Ability.ADD_NOTES]) {
    toggleNotesEditor()
  } else {
    showSponsorshipDialog(Ability.ADD_NOTES)
  }
}

const removeSelectedStar = async () => {
  if (userStore.user?.scope !== AuthScope.PUBLIC_REPO) {
    showUpgradeAuthScopeDialog()
  } else {
    if (
      await isConfirmed(`Are you sure you want to unstar ${starsStore.selectedRepo.nameWithOwner}?`, {
        confirmLabel: "Yes, I'm sure",
        cancelLabel: 'Nevermind',
      })
    ) {
      starsStore.removeStar(starsStore.selectedRepo.id)
    }
  }
}

onKeyStroke('n', e => {
  if (!isFocusedElementEditable()) {
    e.preventDefault()
    handleToggleNotesEditor()
  }
})
</script>
