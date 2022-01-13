import { ref, computed } from 'vue'
import { BaseDialogReturnType } from '@/types'

const isOpen = ref(false)

export const useSmartFiltersDialog = (): BaseDialogReturnType => {
  return {
    isOpen: computed(() => isOpen.value),
    show: () => {
      isOpen.value = true
    },
    hide: () => (isOpen.value = false),
  }
}
