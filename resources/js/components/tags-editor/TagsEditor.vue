<template>
  <div
    class="flex items-center px-1 pt-2 pb-0 bg-white border border-gray-300 rounded-md shadow-sm ring-2 ring-transparent cursor-text focus-within:border-indigo-500 focus-within:ring-indigo-100"
    @click.stop>
    <ul class="relative flex flex-wrap items-center w-full">
      <li
        v-for="(tag, i) in mutableTags"
        :key="tag.name"
        class="
          text-indigo-800
          bg-indigo-100
          px-2
          py-0.5
          mx-1
          mb-2
          rounded-sm
          text-xs
          font-semibold
          tracking-wide
          flex
          items-center
        "
      >
        <span>{{ tag.name }}</span>
        <button class="pl-1 cursor-pointer delete-star-tag" :aria-label="`Delete tag ${tag.name}`" @click.stop="deleteTagAtIndex(i)"><XIcon class="w-3 h-3 fill-current" /></button>
      </li>
      <li class="relative flex-grow mx-1 mb-2 leading-none isolate" style="flex-basis:82px">
        <input ref="input" v-model="tagText" type="text" class="w-full min-w-0 p-0 text-base leading-none bg-transparent border-0 sm:text-sm focus:outline-none focus:border-0 focus:ring-0" placeholder="Add a tag..." role="combobox" aria-activedescendant="tags_autocomplete_list" autocomplete="off" aria-owns="tags_autocomplete_list" @keydown.,.prevent="pushTag" @keydown.delete="deleteLastTag" @blur="onBlur" @keydown.enter="onEnter">

        <!-- Autocomplete Menu -->
        <AutocompleteMenu id="tags_autocomplete_list" :style="{ left: inputRect.left + 'px', top: inputRect.top + inputRect.height + 'px' }" :source="autocompleteOptions" :search="tagText" @select="pushTag($event)" @show="autocompleteShowing = true" @hide="autocompleteShowing = false" />
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, PropType, reactive, ref } from 'vue'
import { useTagsStore } from '@/store/useTagsStore'
import AutocompleteMenu from '@/components/tags-editor/AutocompleteMenu.vue'
import { XIcon } from '@heroicons/vue/solid'
import { Tag } from '@/types'
import { useResizeObserver, whenever } from '@vueuse/core'
export default defineComponent({
  components: {
    AutocompleteMenu,
    XIcon,
  },
  props: {
    tags: {
      type: Array as PropType<Tag[]>,
      default: () => [],
    }
  },
  emits: ['change', 'blur'],
  setup(props, { emit }) {
    const tagsStore = useTagsStore()
    const tagText = ref("")
    const input = ref<HTMLInputElement | null>(null)
    const mutableTags = ref<Pick<Tag, 'name'>[]>(
      props.tags.map(tag => ({ name: tag.name }))
    )
    let inputRect = reactive<Pick<Record<keyof DOMRect, number>, 'top' | 'left' | 'height'>>({
      top: 0,
      left: 0,
      height: 20,
    })
    const autocompleteShowing = ref(false)

    const autocompleteOptions = computed(() => {
      return tagsStore.tags.map(tag => tag.name).filter(tag => {
        return !mutableTags.value.map(tag => tag.name).includes(tag)
      })
    })

    whenever(input, () => {
      useResizeObserver(input, (entries) => {
        const { x, y } = entries[0].target.getBoundingClientRect()
          inputRect.top = y
          inputRect.left = x
      })
    })

    const tagsHasTag = (tag: string) => {
      return mutableTags.value.map(tag => tag.name?.toLowerCase()).includes(tag.toLowerCase())
    }

    const tagsHaveChanged = computed(() => {
      return !(props.tags.length === mutableTags.value.length && props.tags.map(tag => tag.name).every(tag => {
        return mutableTags.value.map(tag => tag.name).includes(tag)
      }))
    })

    const pushTag = (tag: string) => {
      tag ||= tagText.value.trim()
      if (tag && !tagsHasTag(tag)) {
        mutableTags.value.push({ name: tag })
        tagText.value = ''
        input.value?.focus()
      }
    }

    const deleteLastTag = (e: KeyboardEvent) => {
      if (!tagText.value) {
        e.preventDefault()
        mutableTags.value.pop()
      }
    }

    const deleteTagAtIndex = (i: number) => {
      mutableTags.value.splice(i, 1)

      input.value?.focus()
    }

    const onBlur = (e: FocusEvent) => {
      if (!(e.relatedTarget as HTMLButtonElement)?.classList.contains('delete-star-tag') && tagsHaveChanged.value) {
        emit('change', mutableTags)
      } else {
        emit('blur')
      }
    }

    const onEnter = () => {
      if (!autocompleteShowing.value) {
        input.value?.blur()
      }
    }

    nextTick(() => {
      input.value?.focus()
    })

    return {
      allTags: computed(() => tagsStore.tags),
      mutableTags,
      tagText,
      pushTag,
      deleteLastTag,
      deleteTagAtIndex,
      onBlur,
      onEnter,
      input,
      inputRect,
      autocompleteShowing,
      autocompleteOptions,
    }
  }
})
</script>

<style scoped>
</style>
