import { Ref, ref } from 'vue'

const isOpen = ref(false)

interface NotesEditorReturnType {
  isOpen: Ref<boolean>
  show(): void,
  hide(): void,
  toggle(): void,
}

export const useNotesEditor = (): NotesEditorReturnType => {
  return {
    isOpen,
    show: () => isOpen.value = true,
    hide: () => isOpen.value = false,
    toggle: () => isOpen.value = !isOpen.value,
  }
}
