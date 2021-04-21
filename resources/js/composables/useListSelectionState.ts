import { useMagicKeys } from '@vueuse/core'
import { ref, computed, Ref } from 'vue'

const { shift, cmd, ctrl } = useMagicKeys()

interface ListSelectionStateReturnType<T> {
  updateSelectedItems(item: T): Ref<T[]>
}

export const useListSelectionState = <T>(
  items: () => T[]
): ListSelectionStateReturnType<T> => {
  const allItems = items()
  const selectedItems = ref([]) as Ref<T[]>
  const isHoldingMetaKey = computed(() => cmd.value || ctrl.value)
  const lastSelectedItem = ref(null) as Ref<Nullable<T>>

  const itemIsSelected = (item: T): boolean => {
    return selectedItems.value.includes(item)
  }

  const indexOfItem = (item: T): number => {
    return allItems.indexOf(item)
  }

  const lastSelectedIndex = computed(() => {
    if (lastSelectedItem.value) {
      return indexOfItem(lastSelectedItem.value)
    }

    return 0
  })

  const removeItemFromSelection = (item: T) => {
    const itemIndex = selectedItems.value.indexOf(item)

    if (~itemIndex) {
      selectedItems.value = selectedItems.value.filter(
        (__, index) => itemIndex !== index
      )
    }
  }

  const appendItemToSelection = (item: T) => {
    selectedItems.value = [...new Set(selectedItems.value.concat([item]))]
  }

  const setSingleSelectedItem = (item: T) => {
    selectedItems.value = [item]
  }

  const getItemsFromRange = (start: number, end: number): T[] => {
    const selectedItems = []
    const [low, high] = [start, end].sort((a, b) => a - b)

    for (let i = low; i <= high; i++) {
      selectedItems.push(allItems[i])
    }

    return selectedItems
  }

  const setSelectedItemsRange = (item: T) => {
    getItemsFromRange(
      lastSelectedIndex.value,
      indexOfItem(item)
    ).forEach(item => appendItemToSelection(item))
  }

  const updateSelectedItems = (item: T): Ref<T[]> => {
    if (isHoldingMetaKey.value && !shift.value) {
      if (itemIsSelected(item)) {
        removeItemFromSelection(item)
      } else {
        appendItemToSelection(item)
      }
    } else if (shift.value) {
      setSelectedItemsRange(item)
    } else {
      setSingleSelectedItem(item)
    }

    lastSelectedItem.value = item

    return selectedItems
  }

  return {
    updateSelectedItems,
  }
}
