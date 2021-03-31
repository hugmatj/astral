<template>
  <div>
    <div
      role="button"
      class="flex items-center text-gray-500"
      :class="{ '-ml-1': collapsible }"
      @click="toggleCollapsed"
    >
      <CaretIcon
        v-if="collapsible"
        class="relative flex-shrink-0 w-5 h-5 transform"
        :class="{ 'rotate-90': !isCollapsed }"
        style="top: -1px"
      />
      <h3 class="text-xs font-bold tracking-wider uppercase select-none">
        {{ title }}
      </h3>
    </div>
    <div v-show="!isCollapsed">
      <slot />
    </div>
  </div>
</template>

<script>
import { ChevronRightIcon as CaretIcon } from '@heroicons/vue/solid'
export default {
  components: {
    CaretIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapsed: false,
    }
  },
  methods: {
    toggleCollapsed() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed
      }
    },
  },
}
</script>
