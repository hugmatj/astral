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
            <div v-if="editor" class="flex items-center p-2 bg-gray-100 rounded">
            <!-- Bold Button -->
              <button class="p-1 rounded hover:bg-gray-200" :class="{'bg-brand-100 text-brand-700 hover:bg-brand-200': editor.isActive('bold') }" aria-label="Bold" @click="editor?.chain().focus().toggleBold().run()">
                <BoldIcon class="h-5" />
              </button>

              <span class="inline-block mx-2 text-xs font-bold text-gray-300">|</span>

              <!-- Italics Button -->
              <button class="p-1 rounded hover:bg-gray-200" :class="{'bg-brand-100 text-brand-700 hover:bg-brand-200': editor.isActive('italic') }" aria-label="Italic" @click="editor?.chain().focus().toggleItalic().run()">
                <ItalicsIcon class="h-5" />
              </button>

              <span class="inline-block mx-2 text-xs font-bold text-gray-300">|</span>

              <!-- Underline Button -->
              <button class="p-1 rounded hover:bg-gray-200" :class="{'bg-brand-100 text-brand-700 hover:bg-brand-200': editor.isActive('underline') }" aria-label="Underline" @click="editor?.chain().focus().toggleUnderline().run()">
                <UnderlineIcon class="h-5" />
              </button>

              <span class="inline-block mx-2 text-xs font-bold text-gray-300">|</span>

              <!-- Code Button -->
              <button class="p-1 rounded hover:bg-gray-200" :class="{'bg-brand-100 text-brand-700 hover:bg-brand-200': editor.isActive('code') }" aria-label="Inline Code" @click="editor?.chain().focus().toggleCode().run()">
                <CodeIcon class="h-5" />
              </button>

              <span class="inline-block mx-2 text-xs font-bold text-gray-300">|</span>

              <!-- CodeBlock Button -->
              <button class="p-1 rounded hover:bg-gray-200" :class="{'bg-brand-100 text-brand-700 hover:bg-brand-200': editor.isActive('codeBlock') }" aria-label="Code Block" @click="editor?.chain().focus().toggleCodeBlock().run()">
                <CodeBlockIcon class="h-5" />
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
import { computed, watch } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useNotesEditor } from '@/composables/useNotesEditor'
import { useStarsStore } from '@/store/useStarsStore'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import debounce from 'lodash/debounce'
import BoldIcon from '@/components/shared/icons/notes-editor/BoldIcon.vue'
import ItalicsIcon from '@/components/shared/icons/notes-editor/ItalicsIcon.vue'
import UnderlineIcon from '@/components/shared/icons/notes-editor/UnderlineIcon.vue'
import CodeIcon from '@/components/shared/icons/notes-editor/CodeIcon.vue'
import CodeBlockIcon from '@/components/shared/icons/notes-editor/CodeBlockIcon.vue'

const starsStore = useStarsStore()
const { isOpen, hide } = useNotesEditor()

const userStar = computed(() => starsStore.userStarsByRepoId[starsStore.selectedRepo.databaseId])

const initialNotes = JSON.parse(userStar.value?.notes || '{}')

const editor = useEditor({
  content: Object.keys(initialNotes).length ? initialNotes : '<p></p>',
  extensions: [StarterKit, Typography, Underline, Placeholder.configure({
    placeholder: 'Add some notes about this repo...',
  }), CodeBlock],
  onUpdate: debounce(({ editor }) => {
    const notesData = editor.isEmpty ? null : JSON.stringify(editor.getJSON())

    Inertia.put('/star/notes', {
      repoId: starsStore.selectedRepo.databaseId,
      notes: notesData,
    })
  }, 1000),
  editorProps: {
    attributes: {
      class: 'prose focus:outline-none',
    },
  },
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

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>
