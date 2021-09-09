import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import orderBy from 'lodash/orderBy'
import type { FetchDirection, Tag, TagSortMethod } from '@/types'

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
    sortTags(method: TagSortMethod, direction: Lowercase<FetchDirection>) {
      this.tags = orderBy(this.tags, method, direction)
      this.syncTagOrder()
    },
    syncTagOrder() {
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
