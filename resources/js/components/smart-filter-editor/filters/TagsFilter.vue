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
import { useTagsStore } from '@/store/useTagsStore'
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

const tagsStore = useTagsStore()

const autocompleteOptions = computed(() => {
  return tagsStore.tags.map((tag) => tag.name)
})
</script>
