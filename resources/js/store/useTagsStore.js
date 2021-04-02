import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'

export const useTagsStore = defineStore({
  id: 'tags',
  state() {
    return {
      tags: [],
      selectedTag: {},
    }
  },
  actions: {
    addTag(tagName) {
      Inertia.post('/tags', { name: tagName })
    },
    reorderTags() {
      const reorderedTags = this.tags.map((tag, index) => ({
        id: tag.id,
        sort_order: index,
      }))
      Inertia.put('/tags/reorder', { tags: reorderedTags })
    },
    deleteTag(id) {
      Inertia.delete(`/tags/${id}`)
    },
  },
})
