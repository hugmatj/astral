<template>
  <input class="px-3 py-2 ml-2 text-base text-gray-600 transition-colors bg-white border border-transparent rounded-md shadow ring-gray-300 ring-1 w-60 sm:text-sm focus:border-gray-400 focus:ring-gray-400" :type="props.type" />
</template>

<script setup lang="ts">
interface Props {
  type?: 'text' | 'email' | 'password',
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})
</script>
