import type { AbilityContext } from '@/types'

// Taken from: https://github.com/vueuse/vueuse/blob/main/packages/core/onStartTyping/index.ts
export const isFocusedElementEditable = (): boolean => {
  const { activeElement, body } = document

  if (!activeElement) return false

  // If not element has focus, we assume it is not editable, too.
  if (activeElement === body) return false

  // Assume <input> and <textarea> elements are editable.
  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true
  }

  // Check if any other focused element id editable.
  return activeElement.hasAttribute('contenteditable')
}

