import { ref, computed, Ref } from 'vue'
import { Ability } from '@/types'

const isOpen = ref(false)
const currentContext = ref<Ability | null>(null)

interface SponsorshipDialogReturnType {
  isOpen: Ref<boolean>
  currentContext: Ref<Ability | null>
  showDialog(context: Ability): void
  hideDialog(): void
}

export const useSponsorshipDialog = (): SponsorshipDialogReturnType => {
  const showDialog = (context: Ability) => {
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

