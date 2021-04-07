<template>
  <div class="h-full p-4 bg-gray-900">
    <div class="mt-6 space-y-6">
      <SidebarGroup title="Stars">
        <ul class="mt-2 space-y-2">
          <SidebarItem
            title="All Stars"
            :is-active="starsFilterStore.isFilteringByAll"
            @click="starsFilterStore.setFilterByAll"
          >
            <template #icon>
              <InboxIcon />
            </template>
          </SidebarItem>
          <SidebarItem
            title="Untagged Stars"
            :is-active="starsFilterStore.isFilteringByUntagged"
            @click="starsFilterStore.setFilterByUntagged"
          >
            <template #icon>
              <StarIcon />
            </template>
          </SidebarItem>
        </ul>
      </SidebarGroup>
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
      <SidebarGroup title="Languages" collapsible>
        <ul class="mt-2 space-y-2">
          <SidebarItem
            v-for="language in languages"
            :key="language.name"
            :title="language.name"
            :count="language.count"
            :is-active="languageIsSelected(language.name)"
            @click="$emit('language-selected', language.name)"
          />
        </ul>
      </SidebarGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useTagsStore } from '@/store/useTagsStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import draggable from 'vuedraggable'
import SidebarGroup from '@/components/sidebar/SidebarGroup.vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import SidebarTag from '@/components/sidebar/SidebarTag.vue'
import { InboxIcon, StarIcon } from '@heroicons/vue/outline'

export default defineComponent({
  components: {
    draggable,
    SidebarGroup,
    SidebarItem,
    SidebarTag,
    InboxIcon,
    StarIcon,
  },
  emits: ['tag-selected', 'language-selected'],
  setup() {
    const starsFilterStore = useStarsFilterStore()
    const tagsStore = useTagsStore()
    const starsStore = useStarsStore()

    const newTag = ref('')

    const tagIsSelected = (tag: any) =>
      tag.id === starsFilterStore.selectedTag.id

    const languageIsSelected = language =>
      language === starsFilterStore.selectedLanguage

    const onStarDropped = data =>
      starsStore.addTagToStar(data.tag.id, data.starId)

    return {
      newTag,
      starsFilterStore,
      tagIsSelected,
      languageIsSelected,
      addTag: tagsStore.addTag,
      onStarDropped,
      tags: computed({
        get: () => tagsStore.tags,
        set: val => {
          tagsStore.tags = val
        },
      }),
      languages: computed(() => starsStore.languages),
      reorderTags: tagsStore.reorderTags,
    }
  },
})
</script>

<style>
.tag-ghost {
  opacity: 0;
}
</style>
