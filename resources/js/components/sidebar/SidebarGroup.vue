<template>
  <div>
    <div
      role="button"
      class="flex items-center text-gray-500"
      :class="{ '-ml-1': collapsible }"
      @click="toggleCollapsed"
    >
      <svg
        v-if="collapsible"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="relative flex-shrink-0 w-5 h-5 transform"
        :class="{ 'rotate-90': !isCollapsed }"
        style="top: -1px"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
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
export default {
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
    };
  },
  methods: {
    toggleCollapsed() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed;
      }
    },
  },
};
</script>
