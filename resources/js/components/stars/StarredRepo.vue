<template>
  <div
    class="relative p-4 bg-white shadow-sm cursor-pointer dark:bg-gray-800"
    :class="{ 'bg-gray-100 dark:bg-gray-900 shadow-inner': isSelected }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="$emit('selected', repo)"
  >
    <div
      aria-hidden
      class="absolute top-0 left-0 w-1 transition-transform transform  bg-brand-600 -bottom-px"
      :class="{
        'translate-x-0': isSelected,
        '-translate-x-full': !isSelected,
      }"
    ></div>
    <p class="font-semibold text-brand-600">{{ repo.node.nameWithOwner }}</p>
    <p
      class="mt-2 text-sm text-gray-700 line-clamp-5 dark:text-gray-300"
      :title="repo.node.description"
    >
      {{ repo.node.description }}
    </p>
    <ul
      v-if="tags.length || repo.node.primaryLanguage?.name"
      class="inline-flex flex-wrap mt-4 space-x-2"
    >
      <li
        v-if="repo.node.primaryLanguage?.name"
        class="
          text-brand-800
          bg-brand-100
          px-2
          py-0.5
          rounded-sm
          text-xs
          cursor-pointer
          font-semibold
          tracking-wide
        "
        @click.stop="
          $emit('language-selected', repo.node.primaryLanguage?.name)
        "
      >
        {{ repo.node.primaryLanguage.name }}
      </li>
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="
          text-indigo-800
          bg-indigo-100
          px-2
          py-0.5
          rounded-sm
          text-xs
          cursor-pointer
          font-semibold
          tracking-wide
        "
        @click.stop="$emit('tag-selected', tag)"
      >
        {{ tag.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { GitHubRepo } from '@/types'

export default defineComponent({
  props: {
    repo: {
      type: Object as PropType<GitHubRepo>,
      required: true,
    },
  },
  emits: ['selected', 'tag-selected', 'language-selected'],
  setup(props) {
    const starsStore = useStarsStore()

    const tags = computed(() => {
      return (
        starsStore.userStarsByRepoId[props.repo.node.databaseId]?.tags || []
      )
    })

    const isSelected = computed(() =>
      starsStore.selectedRepos
        .map(repo => repo.databaseId)
        .includes(props.repo.node.databaseId)
    )

    let $dragImage: HTMLElement | undefined = undefined

    const onDragStart = (e: DragEvent) => {
      starsStore.isDraggingStar = true

      if (starsStore.selectedRepos.length) {
        if (isSelected.value) {
          starsStore.draggingRepos = [...starsStore.selectedRepos]
        } else {
          starsStore.draggingRepos = [
            props.repo.node,
            ...starsStore.selectedRepos,
          ]
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
      if ($dragImage) {
        document.body.removeChild($dragImage)
      }
    }

    return {
      tags,
      isSelected,
      onDragStart,
      onDragEnd,
    }
  },
})
</script>
