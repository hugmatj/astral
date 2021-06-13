import { ref, computed, Ref } from 'vue'
import { Tag } from '@/types'

const isOpen = ref(false)
const currentTag = ref<Tag | null>(null)

interface RenameTagDialogReturnType {
  isOpen: Ref<boolean>
  currentTag: Ref<Tag | null>,
  showDialog(tag: Tag): void
  hideDialog(): void
}

export const useRenameTagDialog = (): RenameTagDialogReturnType => {
  const showDialog = (tag: Tag) => {
    currentTag.value = tag
    isOpen.value = true
  }

  const hideDialog = () => isOpen.value = false

  return {
    isOpen: computed(() => isOpen.value),
    currentTag: computed(() => currentTag.value),
    showDialog,
    hideDialog
  }
}

