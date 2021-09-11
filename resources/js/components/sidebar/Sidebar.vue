<template>
  <div class="h-full p-4 overflow-y-auto bg-gray-900">
    <div class="mt-6 space-y-6">
      <SidebarGroup title="Stars">
        <ul class="mt-2 space-y-2" role="listbox" aria-label="Stars" tabindex="0">
          <SidebarItem
            title="All Stars"
            :is-active="starsFilterStore.isFilteringByAll"
            :count="totalRepos"
            @click="$emit('all-stars-selected')"
          >
            <template #icon>
              <InboxIcon />
            </template>
          </SidebarItem>
          <SidebarItem
            title="Untagged Stars"
            :is-active="starsFilterStore.isFilteringByUntagged"
            :count="totalUntaggedRepos"
            @click="$emit('untagged-selected')"
          >
            <template #icon>
              <StarIcon />
            </template>
          </SidebarItem>
        </ul>
      </SidebarGroup>
      <SidebarGroup title="Tags" collapsible class="relative">
        <template #right-action>
          <SortTagsMenu v-if="tags.length > 1" class="-mt-1" @sort-tags="sortTags" />
        </template>
        <template #default>
          <div class="relative flex items-center h-10 mt-2">
            <button
              class="inline-flex items-center w-full text-sm font-semibold text-gray-700 transition-colors focus:outline-none focus:text-gray-500 hover:text-gray-500"
              :class="{ 'pointer-events-none': isNewTagFormShowing }"
              type="button"
              @click="showNewTagForm"
            >
              <PlusCircleIcon class="flex-shrink-0 w-5 h-5" aria-hidden="true" />
              <span class="ml-2">Add a tag...</span>
            </button>
            <form
              class="absolute top-0 left-0 w-full transition-opacity duration-150 opacity-0 pointer-events-none"
              :class="{ 'opacity-100 pointer-events-auto': isNewTagFormShowing }"
              @submit.prevent="doAddTag(newTag)"
            >
              <input
                ref="newTagForm"
                v-model="newTag"
                type="text"
                placeholder="Enter a tag name..."
                class="w-full border-0 rounded-sm focus:ring-2 focus:ring-transparent sm:text-sm"
                @blur="isNewTagFormShowing = false"
              />
            </form>
          </div>
          <ul class="mt-2 space-y-2" role="listbox" aria-label="Tags" tabindex="0">
            <draggable
              v-model="tags"
              tag="transition-group"
              item-key="id"
              :animation="300"
              ghost-class="tag-ghost"
              @end="syncTagOrder"
            >
              <template #item="{ element: tag }">
                <SidebarTag
                  :tag="tag"
                  :is-active="tagIsSelected(tag)"
                  @stars-dropped="onStarsDropped"
                  @click="$emit('tag-selected', tag)"
                >
                </SidebarTag>
              </template>
            </draggable>
          </ul>
        </template>
      </SidebarGroup>
      <SidebarGroup title="Languages" collapsible>
        <ul class="mt-2 space-y-2" role="listbox" aria-label="Languages" tabindex="0">
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
import SortTagsMenu from '@/components/sidebar/SortTagsMenu.vue'
import { InboxIcon, StarIcon, PlusCircleIcon } from '@heroicons/vue/outline'
import { Tag, StarDragDataTransferData } from '@/types'

export default defineComponent({
  components: {
    draggable,
    SidebarGroup,
    SidebarItem,
    SidebarTag,
    SortTagsMenu,
    InboxIcon,
    StarIcon,
    PlusCircleIcon,
  },
  emits: [
    'tag-selected',
    'language-selected',
    'all-stars-selected',
    'untagged-selected',
  ],
  setup() {
    const starsFilterStore = useStarsFilterStore()
    const tagsStore = useTagsStore()
    const starsStore = useStarsStore()

    const newTagForm = ref<HTMLElement>()
    const newTag = ref('')
    const isNewTagFormShowing = ref(false)

    const showNewTagForm = () => {
      isNewTagFormShowing.value = true
      newTagForm.value?.focus()
    }

    const doAddTag = () => {
      tagsStore.addTag(newTag.value)
      newTag.value = ''
    }

    const tagIsSelected = (tag: Tag): boolean =>
      tag.id === starsFilterStore.selectedTag?.id

    const languageIsSelected = (language: string): boolean =>
      language === starsFilterStore.selectedLanguage

    const onStarsDropped = (data: StarDragDataTransferData) =>
      starsStore.addTagToStars(data.tag.id, data.repoIds)

    return {
      newTagForm,
      showNewTagForm,
      isNewTagFormShowing,
      newTag,
      starsFilterStore,
      tagIsSelected,
      languageIsSelected,
      doAddTag,
      onStarsDropped,
      tags: computed({
        get: () => tagsStore.tags,
        set: val => {
          tagsStore.tags = val
        },
      }),
      totalRepos: computed(
        () => starsStore.totalRepos || starsStore.starredRepos.length
      ),
      totalUntaggedRepos: computed(() => starsStore.untaggedStars.length),
      languages: computed(() => starsStore.languages),
      sortTags: tagsStore.sortTags,
      syncTagOrder: tagsStore.syncTagOrder,
    }
  },
})
</script>

<style>
.tag-ghost {
  opacity: 0;
}
</style>
