<template>
  <teleport to="body">
    <TransitionFade :show="shouldShow" as="div">
      <ul
        v-show="shouldShow"
        class="absolute z-50 py-1 min-w-[150px] bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg"
        role="combobox"
        v-bind="$attrs"
        :hidden="!shouldShow"
      >
        <li
          v-for="(item, index) in visibleItems"
          :key="item"
          role="option"
          :aria-selected="index === currentIndex"
          class="cursor-pointer"
          @click="selectActiveItem"
          @mouseenter="currentIndex = index"
          @mouseleave="currentIndex = -1"
          @mousedown.prevent
        >
          <div
            class="w-full px-4 py-2 text-xs"
            :class="{
              'text-gray-700 font-medium': index !== currentIndex,
              'bg-brand-500 text-white font-semibold': index === currentIndex,
            }"
          >
            {{ item }}
          </div>
        </li>
      </ul>
      <span class="sr-only" role="status" aria-live="assertive" aria-atomic="true" hidden>
        {{ visibleItems.length }}
        {{ visibleItems.length === 1 ? 'result' : 'results' }} found
      </span>
    </TransitionFade>
  </teleport>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref, watch } from 'vue'
  import TransitionFade from '@/components/shared/transitions/TransitionFade.vue'
  import fuzzysearch from 'fuzzysearch'
  import { onKeyStroke } from '@vueuse/core'

  export default defineComponent({
    components: {
      TransitionFade,
    },
    inheritAttrs: false,
    props: {
      source: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      search: {
        type: String,
        default: '',
      },
    },
    emits: ['select', 'show', 'hide'],
    setup(props, { emit }) {
      const currentIndex = ref(-1)
      const isVisible = ref(false)

      const visibleItems = computed(() => {
        if (props.search.trim().length < 2) {
          return []
        }

        return props.source
          .filter((haystack) => fuzzysearch(props.search.toLowerCase(), haystack.toLowerCase()))
          .slice(0, 5)
      })
      const hasResults = computed(() => !!visibleItems.value.length)
      const shouldShow = computed(() => isVisible.value && hasResults.value)

      watch(visibleItems, (oldItems, items) => {
        if ((!oldItems.length && items.length) || (oldItems.length && !items.length)) {
          currentIndex.value = 0
        }
      })

      watch(hasResults, (shouldShow) => {
        isVisible.value = shouldShow
        emit(shouldShow ? 'show' : 'hide')
      })

      watch(
        () => props.search,
        () => (isVisible.value = true)
      )

      const selectActiveItem = () => {
        emit('select', visibleItems.value[currentIndex.value])
      }

      onKeyStroke('ArrowDown', (e) => {
        if (isVisible.value) {
          e.preventDefault()
          currentIndex.value = Math.min(visibleItems.value.length - 1, currentIndex.value + 1)
        }
      })

      onKeyStroke('ArrowUp', (e) => {
        if (isVisible.value) {
          e.preventDefault()
          currentIndex.value = Math.max(0, currentIndex.value - 1)
        }
      })

      onKeyStroke('Enter', (e) => {
        if (isVisible.value) {
          e.preventDefault()
          selectActiveItem()
        }
      })

      onKeyStroke('Escape', () => (isVisible.value = false))

      return {
        currentIndex,
        visibleItems,
        shouldShow,
        selectActiveItem,
      }
    },
  })
</script>
