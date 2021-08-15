<template>
  <button type="button" class="inline-flex items-center border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2" :class="[classesForSizeProp, classesForKindProp]">
      <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    size: {
      type: String as PropType<'sm' | 'base' | 'lg' | 'xl'>,
      default: 'base'
    },
    kind: {
      type: String as PropType<'base' | 'primary' | 'danger'>,
      default: 'base'
    },
  },
  setup (props) {
    const classesForSizeProp = {
      sm: 'px-2.5 py-1.5 text-xs',
      base: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-sm',
      xl: 'px-4 py-2 text-base',
    }[props.size]

    const classesForKindProp = {
      base: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-brand-500 font-medium',
      primary: 'text-white bg-brand-600 border-transparent hover:bg-brand-700 focus:ring-brand-500 font-semibold',
      danger: 'text-white bg-red-600 border-transparent hover:bg-red-700 focus:ring-red-500 font-semibold',
    }[props.kind]

    return {
      classesForSizeProp,
      classesForKindProp,
    }
  }
})
</script>
