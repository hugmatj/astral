<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="isOpen" @close="hideSettingsModal">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <DialogTitle class="w-full px-4 py-2 font-bold text-gray-700 bg-gray-100 border-b border-gray-200 rounded-t-lg">Settings</DialogTitle>
            <div class="flex items-center px-4 py-5">
              <p class="text-gray-700">Show Language Tags</p>
              <BaseToggle class="ml-auto" :enabled="userStore.user?.settings.show_language_tags" @change="updateUserSetting('show_language_tags', !!$event)" />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  } from "@headlessui/vue";
  import BaseToggle from "@/components/shared/core/BaseToggle.vue";
  import { useSettingsModal } from '@/composables/useSettingsModal'
  import { useUserStore } from '@/store/useUserStore';
  import { Inertia } from '@inertiajs/inertia'

  const { isOpen, hideSettingsModal } = useSettingsModal();
  const userStore = useUserStore();

  const updateUserSetting = (setting: string, enabled: boolean) => {
    Inertia.put(`/settings`, { key: setting, enabled });
  }
</script>
