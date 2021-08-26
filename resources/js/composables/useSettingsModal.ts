import { Ref, ref } from 'vue'

const isOpen = ref(false)

interface SettingsModalReturnType {
  isOpen: Ref<boolean>
  showSettingsModal(): void,
  hideSettingsModal(): void,
}

export const useSettingsModal = (): SettingsModalReturnType => {
  return {
    isOpen,
    showSettingsModal: () => {
      isOpen.value = true
    },
    hideSettingsModal: () => {
      isOpen.value = false
    }
  }
}
