import { ref, computed, Ref } from 'vue'
import { Tag } from '@/types'
import { BaseDialogReturnType } from '@/types'

const isOpen = ref(false)
const currentTag = ref<Nullable<Tag>>(null)

interface RenameTagDialogReturnType extends Omit<BaseDialogReturnType, 'show'> {
  isOpen: Ref<boolean>
  currentTag: Ref<Nullable<Tag>>
  show(tag: Tag): void
  hide(): void
}

export const useRenameTagDialog = (): RenameTagDialogReturnType => {
  return {
    isOpen: computed(() => isOpen.value),
    currentTag: computed(() => currentTag.value),
    show: (tag: Tag) => {
      currentTag.value = tag
      isOpen.value = true
    },
    hide: () => (isOpen.value = false),
  }
}
