<template>
  <li
    class="p-4 bg-white shadow-sm cursor-pointer"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <p class="font-semibold text-brand-600">{{ star.node.nameWithOwner }}</p>
    <p
      class="mt-2 text-sm text-gray-700 line-clamp-5"
      :title="star.node.description"
    >
      {{ star.node.description }}
    </p>
  </li>
</template>

<script>
import { useStarsStore } from '@/store/useStarsStore'
export default {
  props: {
    star: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const starsStore = useStarsStore()

    let $dragImage = undefined

    const onDragStart = e => {
      starsStore.isDraggingStar = true
      $dragImage = document.createElement('div')
      $dragImage.classList.add(
        ...[
          'star-drag-image',
          'inline-block',
          'bg-white',
          'shadow-md',
          'p-4',
          'font-semibold',
          'rounded-md',
          'text-brand-600',
          'absolute',
          'left-0',
          'z-10',
        ]
      )
      $dragImage.innerHTML = `<span>${props.star.node.nameWithOwner}</span>`
      $dragImage.style.top = '-999px'
      document.body.appendChild($dragImage)
      e.dataTransfer.effectAllowed = 'copyLink'
      e.dataTransfer.setDragImage($dragImage, 0, 0)
      e.dataTransfer.setData('text/plain', JSON.stringify(props.star.node))
    }

    const onDragEnd = () => {
      document.body.removeChild($dragImage)
    }

    return {
      onDragStart,
      onDragEnd,
    }
  },
}
</script>
