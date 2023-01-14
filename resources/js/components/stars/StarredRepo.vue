<template>
  <div
    class="relative p-4 bg-white shadow-sm cursor-pointer dark:bg-gray-800 group border-b border-gray-300"
    :class="{ 'bg-gray-100 dark:bg-gray-800 shadow-inner': isSelected }"
    draggable="true"
    role="option"
    :aria-selected="isSelected"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="$emit('selected', repo)"
  >
    <div
      aria-hidden
      class="absolute top-0 left-0 w-1 transition-transform transform bg-brand-600 -bottom-px"
      :class="{
        'translate-x-0': isSelected,
        '-translate-x-full': !isSelected,
      }"
    ></div>
    <p class="font-semibold text-brand-600">{{ repo.node.nameWithOwner }}</p>
    <p class="mt-2 text-sm text-gray-700 line-clamp-5 dark:text-gray-300" :title="repo.node.description">
      {{ repo.node.description }}
    </p>
    <TagsEditor
      v-if="isEditingTags"
      :tags="tags"
      :autocomplete-options="autocompleteOptions"
      class="mt-4"
      @change="syncTagsToStar(repo.node, $event)"
      @blur="isEditingTags = false"
    />
    <ul v-if="!isEditingTags" class="inline-flex flex-wrap items-start mt-4">
      <li
        v-if="shouldShowLanguageTag && repo.node.primaryLanguage?.name"
        class="text-brand-800 bg-brand-100 dark:bg-brand-800 dark:text-brand-200 px-2 py-0.5 rounded-sm text-xs cursor-pointer font-semibold tracking-wide mr-1 mb-1"
        role="button"
        @click.stop="$emit('language-selected', repo.node.primaryLanguage?.name)"
      >
        {{ repo.node.primaryLanguage.name }}
      </li>
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="text-indigo-800 bg-indigo-100 dark:bg-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-sm text-xs cursor-pointer font-semibold tracking-wide mr-1 mb-1"
        role="button"
        @click.stop="$emit('tag-selected', tag)"
      >
        {{ tag.name }}
      </li>
      <li
        class="transition-opacity text-gray-600 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-sm text-xs font-semibold cursor-pointer tracking-wide opacity-0 group-hover:opacity-100"
        :class="{
          'opacity-100': !tags.length && !repo.node.primaryLanguage?.name,
        }"
        role="button"
        @click.stop="isEditingTags = true"
      >
        Edit Tags
      </li>
    </ul>
    <div class="flex items-center mt-4 space-x-4 text-gray-500 dark:text-gray-400">
      <div class="flex items-center">
        <StarIcon class="w-4 h-4" />
        <span class="ml-1 text-xs font-medium">{{ repo.node.stargazers.totalCount.toLocaleString() }}</span>
      </div>
      <div class="flex items-center">
        <ShareIcon class="w-4 h-4" />
        <span class="ml-1 text-xs font-medium">{{ repo.node.forkCount.toLocaleString() }}</span>
      </div>
      <a
        class="flex items-center transition-colors group-scope"
        :href="repo.node.url"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >
        <GlobeIcon class="w-4 h-4" />
        <span class="ml-1 text-xs font-medium group-scope-hover:underline">Visit</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, Ref } from 'vue'
import TagsEditor from '@/components/tags-editor/TagsEditor.vue'
import { useUserStore } from '@/store/useUserStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useTagsStore } from '@/store/useTagsStore'
import { StarIcon, ShareIcon, GlobeIcon } from '@heroicons/vue/outline'
import { GitHubRepo, GitHubRepoNode, StarMetaInput, TagEditorTag } from '@/types'
import { pick } from 'lodash'

export default defineComponent({
  components: {
    TagsEditor,
    StarIcon,
    ShareIcon,
    GlobeIcon,
  },
  props: {
    repo: {
      type: Object as PropType<GitHubRepo>,
      required: true,
    },
  },
  emits: ['selected', 'tag-selected', 'language-selected'],
  setup(props) {
    const userStore = useUserStore()
    const starsStore = useStarsStore()
    const tagsStore = useTagsStore()

    const tags = computed(() => {
      return starsStore.userStarsByRepoId[props.repo.node.databaseId]?.tags || []
    })

    const shouldShowLanguageTag = computed(() => !!userStore.user?.settings.show_language_tags)

    const isEditingTags = ref(false)

    const isSelected = computed(() =>
      starsStore.selectedRepos.map(repo => repo.databaseId).includes(props.repo.node.databaseId)
    )

    const autocompleteOptions = computed(() => {
      return tagsStore.tags.map(tag => tag.name)
    })

    const syncTagsToStar = (repoNode: GitHubRepoNode, tags: TagEditorTag[]) => {
      const starInput: StarMetaInput = pick(repoNode, ['databaseId', 'nameWithOwner', 'url', 'description'])
      starsStore.syncTagsToStar(starInput, tags)

      isEditingTags.value = false
    }

    let $dragImage: Maybe<HTMLElement> = undefined

    const onDragStart = (e: DragEvent) => {
      starsStore.isDraggingRepo = true

      if (starsStore.selectedRepos.length) {
        if (isSelected.value) {
          starsStore.draggingRepos = [...starsStore.selectedRepos]
        } else {
          starsStore.draggingRepos = [props.repo.node, ...starsStore.selectedRepos]
        }
      } else {
        starsStore.draggingRepos = [props.repo.node]
      }

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
      if (starsStore.draggingRepos.length > 1) {
        $dragImage.innerHTML = `<span>${props.repo.node.nameWithOwner} + ${
          starsStore.draggingRepos.length - 1
        } more</span>`
      } else {
        $dragImage.innerHTML = `<span>${props.repo.node.nameWithOwner}</span>`
      }
      $dragImage.style.top = '-999px'
      document.body.appendChild($dragImage)

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'copyLink'
        e.dataTransfer.setDragImage($dragImage, 0, 0)
      }
    }

    const onDragEnd = () => {
      starsStore.isDraggingRepo = false
      starsStore.draggingRepos = []
      if ($dragImage) {
        document.body.removeChild($dragImage)
      }
    }

    return {
      tags,
      autocompleteOptions,
      isSelected,
      onDragStart,
      onDragEnd,
      syncTagsToStar,
      isEditingTags,
      shouldShowLanguageTag,
    }
  },
})
</script>
