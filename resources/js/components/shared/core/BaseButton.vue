<template>
  <component
    :is="buttonElement"
    :type="resolvedButtonType"
    class="inline-flex items-center justify-center text-center transition rounded cursor-pointer focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-0"
    :class="[classesForSizeProp, classesForKindProp]"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

export default defineComponent({
  props: {
    as: {
      type: String as PropType<'button' | 'link'>,
      default: 'button',
    },
    size: {
      type: String as PropType<'sm' | 'base' | 'lg' | 'xl'>,
      default: 'base',
    },
    kind: {
      type: String as PropType<
        | 'base'
        | 'primary'
        | 'warning'
        | 'danger'
        | 'base-borderless'
        | 'primary-borderless'
        | 'warning-borderless'
        | 'danger-borderless'
      >,
      default: 'base',
    },
    buttonType: {
      type: String as PropType<'button' | 'submit'>,
      default: 'button',
    },
  },
  setup(props) {
    const buttonElement = computed(() => (props.as === 'link' ? 'a' : 'button'))
    const resolvedButtonType = computed(() => (props.as === 'link' ? null : props.buttonType))

    const classesForSizeProp = {
      sm: 'px-2.5 py-1.5 text-xs',
      base: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-sm',
      xl: 'px-4 py-3 text-base',
    }[props.size]

    const classesForKindProp = {
      base: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus-visible:ring-brand-500 font-medium active:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 border shadow-sm',
      primary:
        'text-white bg-brand-600 border-transparent hover:bg-brand-700 focus-visible:ring-brand-500 font-semibold border shadow-sm',
      warning:
        'text-white bg-yellow-500 border-transparent hover:bg-yellow-600 focus-visible:ring-yellow-400 font-semibold border shadow-sm',
      danger:
        'text-white bg-red-600 border-transparent hover:bg-red-700 focus-visible:ring-red-500 font-semibold border shadow-sm',
      'base-borderless': 'text-gray-700 bg-transparent focus-visible:ring-brand-500 font-medium dark:text-gray-900',
      'primary-borderless': 'text-brand-600 hover:text-brand-700 focus-visible:ring-brand-500 font-semibold',
      'warning-borderless': 'text-yellow-500 hover:text-yellow-600 focus-visible:ring-yellow-400 font-semibold',
      'danger-borderless':
        'text-red-600 border-transparent hover:text-red-700 focus-visible:ring-red-500 font-semibold',
    }[props.kind]

    return {
      buttonElement,
      resolvedButtonType,
      classesForSizeProp,
      classesForKindProp,
    }
  },
})
</script>
