<template>
  <input v-model="value" class="px-3 py-2 text-base text-gray-600 transition-colors bg-white border border-transparent rounded-md shadow ring-gray-300 ring-1 sm:text-sm focus:border-gray-400 focus:ring-gray-400" :type="props.type" />
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

interface Props {
  type?: 'text' | 'email' | 'password',
  modelValue?: string,
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = useVModel(props, 'modelValue', emit)
</script>
