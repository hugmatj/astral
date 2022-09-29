<template>
  <div class="flex items-center">
    <div>
      <label for="repo_clone_url" class="text-sm font-semibold text-gray-600 cursor-pointer">Clone:</label>
      <BaseTextInput
        id="repo_clone_url"
        ref="input"
        v-model="cloneUrl"
        readonly
        class="ml-2 w-60"
        type="text"
        aria-keyshortcuts="c"
        @focus="selectUrlText"
      />
    </div>
    <RadioGroup v-model="currentUrlType" class="px-3 isolate">
      <RadioGroupLabel class="sr-only">Clone URL Type</RadioGroupLabel>
      <RadioGroupOption v-slot="{ checked }" as="template" value="ssh">
        <div
          class="py-0.5 px-1.5 font-bold text-center rounded-full text-xxs cursor-pointer"
          :class="{
            'bg-transparent text-gray-600 dark:text-gray-400': !checked,
            'bg-gray-600 text-white dark:bg-gray-500': checked,
          }"
        >
          <span>SSH</span>
        </div>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" as="template" value="https">
        <div
          class="py-0.5 px-1.5 font-bold text-center rounded-full text-xxs cursor-pointer"
          :class="{
            'bg-transparent text-gray-600 dark:text-gray-400': !checked,
            'bg-gray-600 text-white dark:bg-gray-500': checked,
          }"
        >
          <span>HTTPS</span>
        </div>
      </RadioGroupOption>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import { onKeyStroke } from '@vueuse/core'
import { isFocusedElementEditable } from '@/utils'

type CloneUrlType = 'ssh' | 'https'

const starsStore = useStarsStore()

const currentUrlType: Ref<CloneUrlType> = ref('ssh')
const input = ref<typeof BaseTextInput | null>(null)

const cloneUrl = computed(() => {
  return currentUrlType.value === 'ssh'
    ? `git@github.com:${starsStore.selectedRepo?.nameWithOwner}.git`
    : `${starsStore.selectedRepo?.url}.git`
})

const selectUrlText = (e: FocusEvent) => {
  ;(e?.currentTarget as HTMLInputElement)?.select()
}

onKeyStroke('c', e => {
  const inputEl: HTMLInputElement = input.value?.$el
  if (!isFocusedElementEditable() && inputEl) {
    e.preventDefault()
    inputEl.focus()
  }
})
</script>
