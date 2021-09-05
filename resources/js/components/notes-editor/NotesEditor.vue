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
            <div v-if="editor" class="flex items-center py-2 bg-gray-100 divide-x divide-gray-300 rounded">
              <button class="px-3" aria-label="Bold" @click="editor?.chain().focus().toggleBold().run()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
              </button>
              <button class="px-3" aria-label="Italic" @click="editor?.chain().focus().toggleItalic().run()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
              </button>
              <button class="px-3" aria-label="Underline" @click="editor?.chain().focus().toggleUnderline().run()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
              </button>
              <button class="px-3" aria-label="Inline Code" @click="editor?.chain().focus().toggleCode().run()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </button>
              <button class="px-3" aria-label="Code Block" @click="editor?.chain().focus().toggleCodeBlock().run()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </button>
            </div>
            <EditorContent :editor="editor" class="h-full mt-4" />
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
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useNotesEditor } from '@/composables/useNotesEditor'
import { useStarsStore } from '@/store/useStarsStore'
import debounce from 'lodash/debounce'
import { Inertia } from '@inertiajs/inertia'
import { computed, watch } from 'vue'
const { isOpen, hide } = useNotesEditor()

const starsStore = useStarsStore()

const userStar = computed(() => starsStore.userStarsByRepoId[starsStore.selectedRepo.databaseId])

let initialNotes = JSON.parse(userStar.value?.notes || '{}')

const editor = useEditor({
  content: Object.keys(initialNotes).length ? initialNotes : '<p></p>',
  extensions: [StarterKit, Typography, Underline, Placeholder.configure({
    placeholder: 'Add some notes about this repo...',
  }), CodeBlock.configure({
    HTMLAttributes: {
      class: 'bg-gray-800 p-4 rounded text-gray-50 text-sm leading-loose'
    }
  })],
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
  editor.value?.commands.focus('end')
})

watch(isOpen, (newVal) => {
  if (newVal) {
    editor.value?.commands.focus('end')
  }
})
</script>

<style lang="postcss">
.ProseMirror {
  @apply h-full;
}

.ProseMirror.ProseMirror-focused {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>
