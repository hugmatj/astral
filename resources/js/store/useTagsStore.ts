import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import type { Tag } from '@/types'

export const useTagsStore = defineStore({
  id: 'tags',
  state() {
    return {
      tags: [] as Tag[],
    }
  },
  actions: {
    addTag(tagName: string) {
      Inertia.post('/tags', { name: tagName })
    },
    reorderTags() {
      const reorderedTags = this.tags.map((tag, index) => ({
        id: tag.id,
        sort_order: index,
      }))
      Inertia.put('/tags/reorder', { tags: reorderedTags } as any)
    },
    deleteTag(id: number) {
      Inertia.delete(`/tags/${id}`)
    },
  },
})
