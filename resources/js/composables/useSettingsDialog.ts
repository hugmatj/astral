import { ref } from 'vue'
import { BaseDialogReturnType } from '@/types'

const isOpen = ref(false)

export const useSettingsDialog = (): BaseDialogReturnType => {
  return {
    isOpen,
    show: () => {
      isOpen.value = true
    },
    hide: () => {
      isOpen.value = false
    },
  }
}
