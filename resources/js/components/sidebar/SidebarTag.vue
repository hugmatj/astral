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

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import { TagIcon } from '@heroicons/vue/outline'
import { useStarsStore } from '@/store/useStarsStore'
import { Tag } from '@/types'

export default defineComponent({
  components: {
    SidebarItem,
    TagIcon,
  },
  props: {
    tag: {
      type: Object as PropType<Tag>,
      required: true,
    },
    isActive: Boolean,
  },
  emits: ['stars-dropped'],
  setup(props, { emit }) {
    const isHighlighted = ref(false)

    const starsStore = useStarsStore()

    const onDragOver = (e: DragEvent) => {
      e.preventDefault()

      if (starsStore.isDraggingStar) {
        isHighlighted.value = true
      }
    }
    const onDragLeave = () => (isHighlighted.value = false)

    const onDrop = (e: DragEvent) => {
      if (starsStore.isDraggingStar && starsStore.draggingRepos.length) {
        emit('stars-dropped', {
          tag: props.tag,
          repoIds: starsStore.draggingRepos.map(repo => repo.databaseId),
        })
        starsStore.isDraggingStar = false
        starsStore.draggingRepos = []
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
})
</script>

<style></style>
