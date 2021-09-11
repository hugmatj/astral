<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="isOpen" @close="isOpen = false">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-yellow-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationIcon class="w-6 h-6 text-yellow-800" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Elevated Privileges Required
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm leading-6 text-gray-500">
                    Unstarring repositories requires your authorization scope to be upgraded from <code class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800">read:user</code> to <code class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800">public_repo</code>. If you would like to learn more about authorization scopes, you can consult the <a href="https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps" target="_blank" rel="noopener noreferrer" class="font-semibold text-gray-800 underline focus-within:outline-none">official GitHub documentation</a>.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button type="button" class="inline-flex justify-center w-full px-4 py-2 text-base font-semibold text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm" @click="redirectToGitHub">
                Grant Access
              </button>
              <button ref="cancelButtonRef" type="button" class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" @click="hide">
                Nevermind
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUpgradeAuthScopeDialog } from '@/composables/useUpgradeAuthScopeDialog'
import { ExclamationIcon } from '@heroicons/vue/outline'

const { isOpen, hide, redirectToGitHub } = useUpgradeAuthScopeDialog()
</script>
