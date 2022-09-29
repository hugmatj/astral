<template>
  <TagsEditor
    :value="modelValue"
    :can-create="false"
    :autocomplete-options="autocompleteOptions"
    class="flex-grow"
    @change="$emit('update:modelValue', $event)"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import TagsEditor from '@/components/tags-editor/TagsEditor.vue'
import { useStarsStore } from '@/store/useStarsStore'
import { TagEditorTag } from '@/types'

interface Props {
  modelValue?: TagEditorTag[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TagEditorTag[]): void
}>()

const starsStore = useStarsStore()

const autocompleteOptions = computed(() => {
  return starsStore.languages.map(language => language.name)
})
</script>
