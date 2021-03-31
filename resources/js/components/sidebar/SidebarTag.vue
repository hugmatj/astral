<template>
  <SidebarItem
    :title="tag.name"
    :count="tag.stars_count"
    :is-active="isActive"
    :is-highlighted="isHighlighted"
    class="py-1 rounded-md sidebar-tag"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <template #icon>
      <TagIcon />
    </template>
  </SidebarItem>
</template>

<script>
import { ref } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem'
import { TagIcon } from '@heroicons/vue/outline'
import { useStarsStore } from '@/store/useStarsStore'

export default {
  components: {
    SidebarItem,
    TagIcon,
  },
  props: {
    tag: {
      type: Object,
      required: true,
    },
    isActive: Boolean,
  },
  emits: ['star-dropped'],
  setup(props, { emit }) {
    const isHighlighted = ref(false)

    const starsStore = useStarsStore()

    const onDragOver = e => {
      e.preventDefault()
      if (starsStore.isDraggingStar) {
        isHighlighted.value = true
      }
    }
    const onDragLeave = e => {
      isHighlighted.value = false
    }
    const onDrop = e => {
      if (starsStore.isDraggingStar) {
        const star = JSON.parse(e.dataTransfer.getData('text/plain'))
        emit('star-dropped', { tag: props.tag, starId: star.databaseId })
        starsStore.isDraggingStar = false
        isHighlighted.value = false
      }
      e.preventDefault()
    }

    return {
      onDragOver,
      onDragLeave,
      onDrop,
      isHighlighted,
    }
  },
}
</script>

<style></style>
