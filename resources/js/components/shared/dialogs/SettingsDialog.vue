<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" static class="fixed inset-0 z-20 overflow-y-auto" :open="isOpen" @close="hide">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
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
            class="inline-block w-full max-w-sm overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-xl"
          >
            <DialogTitle
              class="w-full px-4 py-3 font-bold text-gray-700 bg-gray-100 border-b border-gray-200 rounded-t-lg"
              >Settings</DialogTitle
            >
            <div class="divide-y divide-gray-300">
              <div class="px-4 py-5">
                <div class="flex items-center">
                  <p class="text-sm font-bold text-gray-600">Show Language Tags</p>
                  <BaseToggle
                    class="ml-auto"
                    :enabled="userStore.user?.settings.show_language_tags"
                    @change="updateUserSetting('show_language_tags', !!$event)"
                  />
                </div>
              </div>

              <div class="px-4 py-5">
                <div class="flex items-center">
                  <p class="text-sm font-bold text-gray-600">Auto-Save Notes</p>
                  <BaseToggle
                    class="ml-auto"
                    :enabled="userStore.user?.settings.autosave_notes"
                    @change="updateUserSetting('autosave_notes', !!$event)"
                  />
                </div>
              </div>

              <div class="px-4 py-5">
                <div class="flex items-center">
                  <p class="text-sm font-bold text-gray-600">GitHub Access</p>
                  <BaseButton class="ml-auto" kind="danger" size="sm" @click="Inertia.post('/revoke-grant')"
                    >Revoke Access</BaseButton
                  >
                </div>
                <p class="mt-4 text-sm text-gray-500">
                  This will log you out and revoke your authorization granted to Astral for accessing your GitHub
                  account. You will not lose any data.
                </p>
              </div>

              <div class="px-4 py-5">
                <div class="flex items-center">
                  <p class="text-sm font-bold text-gray-600">Delete Account</p>
                  <div class="flex items-center ml-auto space-x-3">
                    <div v-show="isRequestingDeleteConfirmation">
                      <label for="confirm-user-delete" class="sr-only">Enter your username to confirm</label>
                      <BaseTextInput
                        id="confirm-user-delete"
                        ref="confirmInput"
                        v-model="usernameConfirmation"
                        placeholder="Enter your username to confirm"
                        class="w-60"
                      />
                    </div>
                    <BaseButton kind="danger" size="sm" :disabled="deleteButtonIsDisabled" @click="deleteUser">{{
                      deleteButtonLabel
                    }}</BaseButton>
                  </div>
                </div>
                <p class="mt-4 text-sm text-gray-500">
                  This will permanently delete <strong>all</strong> of your data on this site, and revoke your
                  authorization granted to Astral.
                  <em>Be careful!</em>
                </p>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { computed, ref, nextTick } from 'vue'
  import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
  import BaseToggle from '@/components/shared/core/BaseToggle.vue'
  import BaseButton from '@/components/shared/core/BaseButton.vue'
  import { useSettingsDialog } from '@/composables/useSettingsDialog'
  import { useUserStore } from '@/store/useUserStore'
  import { Inertia } from '@inertiajs/inertia'

  const { isOpen, hide } = useSettingsDialog()
  const userStore = useUserStore()
  const isRequestingDeleteConfirmation = ref(false)
  const usernameConfirmation = ref('')
  const confirmInput = ref<typeof BaseTextInput | null>()

  const deleteButtonLabel = computed(() =>
    isRequestingDeleteConfirmation.value ? 'Confirm Deletion' : 'Delete My Account'
  )

  const deleteButtonIsDisabled = computed(() => {
    return isRequestingDeleteConfirmation.value && usernameConfirmation.value !== userStore.user?.username
  })

  const updateUserSetting = (setting: string, enabled: boolean) => {
    Inertia.put(
      '/settings',
      { key: setting, enabled },
      {
        only: ['user'],
      }
    )
  }

  const deleteUser = async () => {
    if (!isRequestingDeleteConfirmation.value) {
      isRequestingDeleteConfirmation.value = true
      await nextTick()
      confirmInput.value?.$el.focus()
    } else {
      userStore.deleteUser()
    }
  }
</script>
