<template>
  <div class="h-full p-4 overflow-y-auto bg-gray-900 dark:border-r dark:border-gray-600">
    <div class="mt-6 space-y-6">
      <SidebarGroup title="Stars">
        <ul class="mt-2 space-y-2" role="listbox" aria-label="Stars" tabindex="0">
          <SidebarItem
            title="All Stars"
            :is-active="starsFilterStore.isFilteringByAll"
            :count="totalRepos"
            @click="emit('all-stars-selected')"
          >
            <template #icon>
              <InboxIcon />
            </template>
          </SidebarItem>
          <SidebarItem
            title="Untagged Stars"
            :is-active="starsFilterStore.isFilteringByUntagged"
            :count="totalUntaggedRepos"
            @click="emit('untagged-selected')"
          >
            <template #icon>
              <StarIcon />
            </template>
          </SidebarItem>
        </ul>
      </SidebarGroup>
      <SidebarGroup title="Tags" collapsible class="relative">
        <template #right-action>
          <SortTagsMenu v-if="tags.length > 1" class="-mt-1" @sort-tags="tagsStore.sortTags" />
        </template>
        <template #default>
          <div class="relative flex items-center h-10 mt-2">
            <button
              class="inline-flex items-center w-full text-sm font-semibold text-gray-500 transition-colors focus:outline-none focus:text-gray-400 hover:text-gray-400"
              :class="{ 'pointer-events-none': isNewTagFormShowing }"
              type="button"
              @click="showNewTagForm"
            >
              <PlusCircleIcon class="flex-shrink-0 w-5 h-5" aria-hidden="true" />
              <span class="ml-2">Add a tag...</span>
            </button>
            <form
              class="absolute top-0 left-0 w-full transition-opacity duration-150 opacity-0 pointer-events-none"
              :class="{
                'opacity-100 pointer-events-auto': isNewTagFormShowing,
              }"
              @submit.prevent="doAddTag(newTag)"
            >
              <input
                ref="newTagForm"
                v-model="newTag"
                type="text"
                placeholder="Enter a tag name..."
                class="w-full bg-white border-0 rounded-sm focus:ring-2 focus:ring-transparent sm:text-sm dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400"
                @blur="isNewTagFormShowing = false"
              />
            </form>
          </div>
          <ul class="mt-2" role="listbox" aria-label="Tags" tabindex="0">
            <Sortable
              :list="tags"
              item-key="id"
              :options="{
                ghostClass: 'sortable-ghost',
                animation: 150,
              }"
              class="space-y-2"
              @end="({ oldIndex, newIndex }) => tagsStore.syncTagOrder(oldIndex, newIndex)"
            >
              <template #item="{ element: tag }">
                <SidebarTag
                  :tag="tag"
                  :is-active="tagIsSelected(tag)"
                  @stars-dropped="onStarsDropped"
                  @click="emit('tag-selected', tag)"
                />
              </template>
            </Sortable>
          </ul>
        </template>
      </SidebarGroup>
      <SidebarGroup title="Smart Filters" collapsible class="relative group">
        <template #right-action>
          <button
            class="inline-flex items-center w-full text-sm font-semibold text-gray-400 transition opacity-0 focus:outline-none hover:text-gray-200 group-hover:opacity-100"
            type="button"
            aria-label="Add Smart Filter"
            @click="doShowSmartFilterDialog"
          >
            <PlusCircleIcon class="flex-shrink-0 w-5 h-5" aria-hidden="true" />
          </button>
        </template>
        <template #default>
          <ul class="mt-2 space-y-2" role="listbox" aria-label="Smart Filters" tabindex="0">
            <Sortable
              :list="smartFilters"
              item-key="id"
              :options="{
                ghostClass: 'sortable-ghost',
                animation: 150,
              }"
              class="space-y-2"
              @end="({ oldIndex, newIndex }) => smartFiltersStore.syncSmartFiltersOrder(oldIndex, newIndex)"
            >
              <template #item="{ element: smartFilter }">
                <SidebarSmartFilter
                  :smart-filter="smartFilter"
                  :is-active="smartFilterIsSelected(smartFilter)"
                  @click="emit('smart-filter-selected', smartFilter)"
                />
              </template>
            </Sortable>
          </ul>
        </template>
      </SidebarGroup>
      <SidebarGroup title="Languages" collapsible>
        <ul class="mt-2 space-y-2" role="listbox" aria-label="Languages" tabindex="0">
          <SidebarItem
            v-for="language in starsStore.languages"
            :key="language.name"
            :title="language.name"
            :count="language.count"
            :is-active="languageIsSelected(language.name)"
            @click="emit('language-selected', language.name)"
          />
        </ul>
      </SidebarGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue'
import { Errors } from '@inertiajs/inertia'
import { useTagsStore } from '@/store/useTagsStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import { useSmartFiltersStore } from '@/store/useSmartFiltersStore'
import { useAuthorizationsStore } from '@/store/useAuthorizationsStore'
import { useGlobalToast, ToastType } from '@/composables/useGlobalToast'
import SidebarGroup from '@/components/sidebar/SidebarGroup.vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import SidebarTag from '@/components/sidebar/SidebarTag.vue'
import SidebarSmartFilter from '@/components/sidebar/SidebarSmartFilter.vue'
import { Sortable } from 'sortablejs-vue3'
import SortTagsMenu from '@/components/sidebar/SortTagsMenu.vue'
import { InboxIcon, StarIcon, PlusCircleIcon } from '@heroicons/vue/outline'
import { useSmartFilterDialog } from '@/composables/useSmartFilterDialog'
import { useSponsorshipDialog } from '@/composables/useSponsorshipDialog'
import { SPONSORSHIP_REQUIRED_ERROR } from '@/constants'
import { Tag, StarDragDataTransferData, Ability, SmartFilter } from '@/types'

const emit = defineEmits<{
  (e: 'tag-selected', tag: Tag): void
  (e: 'smart-filter-selected', value: SmartFilter): void
  (e: 'language-selected', value: string): void
  (e: 'all-stars-selected'): void
  (e: 'untagged-selected'): void
}>()

const starsFilterStore = useStarsFilterStore()
const tagsStore = useTagsStore()
const starsStore = useStarsStore()
const smartFiltersStore = useSmartFiltersStore()
const authorizationsStore = useAuthorizationsStore()
const { show: showSmartFilterDialog } = useSmartFilterDialog()
const { show: showSponsorshipDialog } = useSponsorshipDialog()
const { show: showToast } = useGlobalToast()

const newTagForm = ref<HTMLElement>()
const newTag = ref('')
const isNewTagFormShowing = ref(false)

const showNewTagForm = () => {
  isNewTagFormShowing.value = true
  newTagForm.value?.focus()
}

const doAddTag = async (tagName: string) => {
  try {
    await tagsStore.addTag(tagName)
    showToast(`The '${tagName}' tag was added.`)

    newTag.value = ''
  } catch (e) {
    const errors = e as Errors
    if (!errors[SPONSORSHIP_REQUIRED_ERROR]) {
      showToast(errors[Object.keys(errors)[0]], ToastType.Error)
    }
  }
}

const tagIsSelected = (tag: Tag): boolean => tag.id === starsFilterStore.selectedTag?.id

const smartFilterIsSelected = (smartFilter: SmartFilter): boolean =>
  smartFilter.id === starsFilterStore.selectedSmartFilter?.id

const languageIsSelected = (language: string): boolean => language === starsFilterStore.selectedLanguage

const onStarsDropped = (data: StarDragDataTransferData) => starsStore.addTagToStars(data.tag.id, data.repos)

const doShowSmartFilterDialog = () => {
  if (authorizationsStore.abilities[Ability.CREATE_SMART_FILTER]) {
    showSmartFilterDialog()
  } else {
    showSponsorshipDialog(Ability.CREATE_SMART_FILTER)
  }
}

const tags = computed({
  get: () => tagsStore.tags,
  set: val => {
    tagsStore.tags = val
  },
})

const smartFilters = computed({
  get: () => smartFiltersStore.smartFilters,
  set: val => {
    smartFiltersStore.smartFilters = val
  },
})

const totalRepos = computed(() => starsStore.totalRepos || starsStore.starredRepos.length)
const totalUntaggedRepos = computed(() => starsStore.untaggedStars.length)
</script>

<style>
.sortable-ghost {
  opacity: 0;
}
</style>
