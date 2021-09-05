<template>
  <TransitionRoot as="template" :show="isOpen" appear>
    <div class="absolute inset-0 z-30 mt-16">
      <TransitionChild
        as="template"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="absolute inset-0 transition-opacity duration-300 bg-gray-500/75"
          @click.self="hide"
        ></div>
      </TransitionChild>
      <div class="relative w-5/12 h-full py-8 overflow-hidden">
        <TransitionChild
          as="template"
          enter-from="opacity-0 -translate-x-full"
          enter-to="opacity-100 translate-x-0"
          leave-from="opacity-100 translate-x-0"
          leave-to="opacity-0 -translate-x-full"
        >
          <div
            class="h-full p-4 transition duration-300 transform bg-white shadow rounded-r-md"
          >
            <EditorContent :editor="editor" class="h-full" />
          </div>
        </TransitionChild>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useNotesEditor } from '@/composables/useNotesEditor'
import { useStarsStore } from '@/store/useStarsStore'
import debounce from 'lodash/debounce'
import { Inertia } from '@inertiajs/inertia'
import { computed, watch } from 'vue'
const { isOpen, hide } = useNotesEditor()

const starsStore = useStarsStore()

const userStar = computed(() => starsStore.userStarsByRepoId[starsStore.selectedRepo.databaseId])

let initialNotes = JSON.parse(userStar.value.notes || '{}')

const editor = useEditor({
  content: Object.keys(initialNotes).length ? initialNotes : '<p></p>',
  extensions: [StarterKit, Typography],
  onUpdate: debounce(({ editor }) => {
    Inertia.put('/star/notes', {
      repoId: starsStore.selectedRepo.databaseId,
      notes: JSON.stringify(editor.getJSON()),
    })
  }, 1000),
})

watch(() => starsStore.selectedRepo, () => {
  let notes = JSON.parse(userStar.value?.notes || '{}')
  editor.value?.commands.setContent(Object.keys(notes).length ? notes : '<p></p>')
})
</script>

<style lang="postcss">
.ProseMirror {
  @apply h-full;
}
</style>
