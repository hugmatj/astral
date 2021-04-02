<template>
  <div class="h-full p-4 bg-gray-900">
    <div class="mt-6 space-y-6">
      <SidebarGroup title="Tags" collapsible class="relative">
        <form class="mt-2" @submit.prevent="addTag(newTag)">
          <input
            v-model="newTag"
            type="text"
            placeholder="Add a tag..."
            class="w-full border-0 rounded-lg focus:ring-2 focus:ring-gray-500"
          />
        </form>
        <ul class="mt-4 space-y-2">
          <draggable
            v-model="tags"
            tag="transition-group"
            item-key="id"
            :animation="300"
            ghost-class="tag-ghost"
            @end="reorderTags"
          >
            <template #item="{ element: tag }">
              <SidebarTag
                :tag="tag"
                :is-active="tagIsSelected(tag)"
                @star-dropped="onStarDropped"
                @click="$emit('tag-selected', tag)"
              >
              </SidebarTag>
            </template>
          </draggable>
        </ul>
      </SidebarGroup>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useTagsStore } from '@/store/useTagsStore'
import { useStarsStore } from '@/store/useStarsStore'
import draggable from 'vuedraggable'
import SidebarGroup from '@/components/sidebar/SidebarGroup'
import SidebarTag from '@/components/sidebar/SidebarTag'
export default {
  components: {
    draggable,
    SidebarGroup,
    SidebarTag,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
  emits: ['tag-selected'],
  setup(props) {
    const newTag = ref('')

    const tagsStore = useTagsStore()
    const starsStore = useStarsStore()

    const onStarDropped = data =>
      starsStore.addTagToStar(data.tag.id, data.starId)

    const tagIsSelected = tag => tag.id === tagsStore.selectedTag.id

    return {
      newTag,
      tagIsSelected,
      addTag: tagsStore.addTag,
      onStarDropped,
      tags: computed({
        get: () => tagsStore.tags,
        set: val => {
          tagsStore.tags = val
        },
      }),
      reorderTags: tagsStore.reorderTags,
    }
  },
}
</script>

<style>
.tag-ghost {
  opacity: 0;
}
</style>
