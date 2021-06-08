import { ref, computed, Ref } from 'vue'
import { AbilityContext } from '@/types'

const isOpen = ref(false)
const currentContext = ref<AbilityContext | null>(null)

interface SponsorshipDialogReturnType {
  isOpen: Ref<boolean>
  currentContext: Ref<AbilityContext | null>
  showDialog(context: AbilityContext): void
  hideDialog(): void
}

export const useSponsorshipDialog = (): SponsorshipDialogReturnType => {
  const showDialog = (context: AbilityContext) => {
    currentContext.value = context
    isOpen.value = true
  }

  const hideDialog = () => isOpen.value = false

  return {
    isOpen: computed(() => isOpen.value),
    currentContext: computed(() => currentContext.value),
    showDialog,
    hideDialog
  }
}

