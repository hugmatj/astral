<template>
  <TransitionRoot
    :show="isVisible"
    enter-from="opacity-0 translate-x-full"
    enter-to="opacity-100 translate-x-0"
    leave-from="opacity-100 translate-x-0"
    leave-to="opacity-0 translate-x-full"
    as="template"
  >
    <div
      class="
        absolute
        bottom-0
        right-0
        z-30
        flex
        items-center
        px-3
        py-2
        mb-4
        mr-4
        text-sm
        font-semibold
        transition
        duration-300
        transform
        rounded-full
      "
      :class="toastClasses"
      aria-role="status"
      aria-live="assertive"
    >
      <CheckCircleIcon
        v-if="currentType === toastType.Success"
        class="w-5 h-5 mr-1"
        aria-hidden="true"
      />
      <XCircleIcon
        v-if="currentType === toastType.Error"
        class="w-5 h-5 mr-1"
        aria-hidden="true"
      />
      <span class="sr-only">{{
        currentType === toastType.Success ? 'Success: ' : 'Error: '
      }}</span>
      {{ currentMessage }}
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalToast, ToastType } from '@/composables/useGlobalToast'
import { TransitionRoot } from '@headlessui/vue'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/solid'

const { isVisible, currentMessage, currentType } = useGlobalToast()
const toastType = ref(ToastType)
const toastClasses = computed(() => {
  return {
    [ToastType.Success]: 'bg-green-200 text-green-700',
    [ToastType.Error]: 'bg-red-200 text-red-700',
  }[currentType.value]
})
</script>
