<template>
  <li
    class="p-4 bg-white shadow-sm cursor-pointer"
    :class="{ 'bg-gray-100 shadow-inner': isSelected }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="$emit('selected', repo)"
  >
    <p class="font-semibold text-brand-600">{{ repo.node.nameWithOwner }}</p>
    <p
      class="mt-2 text-sm text-gray-700 line-clamp-5"
      :title="repo.node.description"
    >
      {{ repo.node.description }}
    </p>
    <ul v-if="tags.length" class="inline-flex flex-wrap mt-4 space-x-2">
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="text-white bg-brand-600 px-2 py-0.5 rounded-full text-xs cursor-pointer"
        @click.stop="$emit('tag-selected', tag)"
      >
        {{ tag.name }}
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { Tag } from '@/types'

export default defineComponent({
  props: {
    repo: {
      type: Object,
      required: true,
    },
  },
  emits: ['selected', 'tag-selected'],
  setup(props) {
    const starsStore = useStarsStore()

    const tags = computed((): Tag[] => {
      return starsStore.userStarsByRepoId[props.repo.node.databaseId].tags
    })

    const isSelected = computed(
      () => props.repo.node.databaseId === starsStore.selectedRepo.databaseId
    )

    let $dragImage: HTMLElement = undefined

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
      $dragImage.innerHTML = `<span>${props.repo.node.nameWithOwner}</span>`
      $dragImage.style.top = '-999px'
      document.body.appendChild($dragImage)
      e.dataTransfer.effectAllowed = 'copyLink'
      e.dataTransfer.setDragImage($dragImage, 0, 0)
      e.dataTransfer.setData('text/plain', JSON.stringify(props.repo.node))
    }

    const onDragEnd = () => {
      document.body.removeChild($dragImage)
    }

    return {
      tags,
      isSelected,
      onDragStart,
      onDragEnd,
    }
  },
})
</script>
