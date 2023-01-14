<template>
  <BaseDialog :is-open="isOpen" :hide="hide" modal-classes="sm:max-w-xl px-0 pt-0 pb-0 sm:p-0">
    <DialogTitle class="w-full rounded-t-lg border-b border-gray-200 bg-gray-100 p-4 text-xl font-bold text-gray-700"
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
          <BaseButton class="ml-auto" kind="danger" size="sm" @click="router.post('/revoke-grant')"
            >Revoke Access</BaseButton
          >
        </div>
        <p class="mt-4 text-sm text-gray-500">
          This will log you out and revoke your authorization granted to Astral for accessing your GitHub account. You
          will not lose any data.
        </p>
      </div>

      <div class="px-4 py-5">
        <div class="flex items-center">
          <p class="text-sm font-bold text-gray-600">Delete Account</p>
          <div class="ml-auto flex items-center space-x-3">
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
          This will permanently delete <strong>all</strong> of your data on this site, and revoke your authorization
          granted to Astral.
          <em>Be careful!</em>
        </p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { DialogTitle } from '@headlessui/vue'
import BaseDialog from '@/components/shared/core/BaseDialog.vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import BaseToggle from '@/components/shared/core/BaseToggle.vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import { useSettingsDialog } from '@/composables/useSettingsDialog'
import { useUserStore } from '@/store/useUserStore'
import { router } from '@inertiajs/vue3'

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
  router.put(
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
