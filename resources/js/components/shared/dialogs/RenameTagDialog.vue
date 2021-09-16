<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      as="div"
      static
      class="fixed inset-0 z-20 overflow-y-auto"
      :open="isOpen"
      @close="hide"
    >
      <div
        class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
          >
            <form @submit.prevent="renameTag">
              <div>
                <p class="text-center text-gray-500">
                  Enter a new name for your tag
                </p>
                <div class="mt-3 text-center sm:mt-5">
                  <label for="tagName" class="sr-only">Tag Name</label>
                  <BaseTextInput
                    id="tagName"
                    v-model="form.name"
                    type="text"
                    class="block w-full"
                    placeholder="Enter a name for your tag"
                  />
                  <p
                    v-if="form.errors.name"
                    class="mt-2 text-xs text-left text-red-500"
                  >
                    {{ form.errors.name }}
                  </p>
                </div>
              </div>
              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
              >
                <button
                  type="submit"
                  class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:col-start-2 sm:text-sm"
                  :disabled="form.processing"
                >
                  Save Tag
                </button>
                <button
                  ref="cancelButtonRef"
                  type="button"
                  class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  @click="hide"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useRenameTagDialog } from '@/composables/useRenameTagDialog'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import { useForm } from '@inertiajs/inertia-vue3'

const { isOpen, hide, currentTag } = useRenameTagDialog()
const form = useForm({
  name: '',
})

watch([currentTag, isOpen], ([tag, openState]) => {
  if (tag && openState === true) {
    form.name = tag.name
  } else {
    setTimeout(() => {
      form.clearErrors()
    }, 200)
  }
})

const renameTag = () => {
  if (currentTag.value) {
    form.clearErrors().put(`/tags/${currentTag.value.id}`, {
      preserveScroll: true,
      onSuccess: () => hide(),
    })
  }
}
</script>
