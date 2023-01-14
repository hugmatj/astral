<template>
  <BaseDialog :is-open="isOpen" :hide="hide" modal-classes="px-4 pt-5 pb-4 sm:p-6 sm:max-w-lg">
    <div>
      <slot name="icon" />
      <div class="mt-3 text-center sm:mt-5">
        <DialogTitle as="h3" class="text-lg font-medium leading-normal text-gray-900"
          ><slot name="title"
        /></DialogTitle>
        <div class="mt-2">
          <slot name="body" />
        </div>
      </div>
    </div>
    <div
      v-if="$slots.actions"
      class="mt-6 flex flex-col-reverse items-center justify-center space-y-3 space-y-reverse sm:flex-row sm:space-y-0 sm:space-x-3"
    >
      <slot name="actions" />
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import BaseDialog from '@/components/shared/core/BaseDialog.vue'
import { DialogTitle } from '@headlessui/vue'

const props = defineProps<{
  isOpen: boolean
  hide: () => void
}>()
</script>
