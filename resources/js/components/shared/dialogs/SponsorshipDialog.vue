<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="isOpen" @close="hideDialog">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                <UserGroupIcon class="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Sponsorship Required
                </DialogTitle>
                <div class="mt-2">
                  <p v-if="currentMessage" class="text-sm text-gray-500">
                    <span>{{ currentMessage }}</span> you must be an active <a href="https://github.com/sponsors" target="_blank" rel="noopener noreferrer" class="font-semibold text-brand-700 focus:outline-none">GitHub Sponsor</a> of the project. You can sponsor as little as $1 per month to get full access to all of Astral's features.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <a href="https://github.com/sponsors/syropian" rel="noopener noreferrer" target="_blank" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:col-start-2 sm:text-sm" @click="hideDialog">
                I'd like to be a sponsor!
              </a>
              <button ref="cancelButtonRef" type="button" class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:col-start-1 sm:text-sm" @click="hideDialog">
                Nevermind
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { computed, Ref } from 'vue'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useSponsorshipDialog } from '@/composables/useSponsorshipDialog'
import { useAuthorizationsStore } from '@/store/useAuthorizationsStore'
import { UserGroupIcon } from '@heroicons/vue/outline'
import { ABILITY_CONTEXTS } from '@/constants'
import { AbilityContext } from '@/types'

const { isOpen, hideDialog, currentContext } = useSponsorshipDialog()
    const authorizationsStore = useAuthorizationsStore()

    const DIALOG_MESSAGES: Record<AbilityContext, string> = {
      [ABILITY_CONTEXTS.CREATE_TAG]: `To create more than ${authorizationsStore.limits?.max_tags} tags`,
      [ABILITY_CONTEXTS.ADD_NOTES]: 'To add notes to your starred repos',
    }

    const currentMessage: Ref<string | null> = computed(() => currentContext.value ? DIALOG_MESSAGES[currentContext.value] : null)
</script>
