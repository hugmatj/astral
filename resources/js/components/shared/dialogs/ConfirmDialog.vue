<template>
  <ActionDialog
    :is-open="confirmConfig.isOpen"
    :hide="confirmConfig.cancel"
    modal-classes="sm:max-w-md px-4 pt-5 pb-4 sm:p-6"
  >
    <template #icon>
      <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full">
        <ExclamationIcon class="w-6 h-6 text-red-600" aria-hidden="true" />
      </div>
    </template>
    <template #body>
      <p class="leading-normal text-gray-500">
        {{ confirmConfig.message }}
      </p>
    </template>
    <template #actions>
      <BaseButton variant="base" class="w-full" @click="confirmConfig.cancel">
        {{ confirmConfig.cancelLabel }}
      </BaseButton>
      <BaseButton kind="danger" class="w-full" @click="confirmConfig.confirm">
        {{ confirmConfig.confirmLabel }}
      </BaseButton>
    </template>
  </ActionDialog>
</template>

<script lang="ts" setup>
import { ExclamationIcon } from '@heroicons/vue/outline'
import { useConfirm } from '@/composables/useConfirm'
import ActionDialog from '@/components/shared/core/ActionDialog.vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'

const { confirmConfig } = useConfirm()
</script>
