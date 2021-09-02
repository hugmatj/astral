<template>
  <div class="flex items-center ">
    <label for="repo_clone_url" class="text-sm font-semibold text-gray-600 cursor-pointer">Clone:</label>
    <BaseTextInput id="repo_clone_url" v-model="cloneUrl" readonly class="ml-2" type="text" @focus="selectUrlText" />
    <RadioGroup v-model="currentUrlType" class="inline-flex items-center ml-2 isolate">
      <RadioGroupLabel class="sr-only">Clone URL Type</RadioGroupLabel>
      <RadioGroupOption
        v-slot="{ checked }"
        as="template"
        value="ssh"
        >
        <div
          class="relative z-20 px-2 py-1 font-semibold leading-none border rounded-l-full cursor-pointer text-xxs"
          :class="{
            'bg-white text-gray-600 border-gray-300': !checked,
            'bg-brand-500 text-white border-brand-700': checked
          }">
          <span>SSH</span>
        </div>
      </RadioGroupOption>
      <RadioGroupOption
        v-slot="{ checked }"
        as="template"
        value="https"
        >
        <div
          class="relative px-2 py-1 -mx-px font-semibold leading-none border rounded-r-full cursor-pointer text-xxs"
          :class="{
            'bg-white text-gray-600 border-gray-300 z-10': !checked,
            'bg-brand-500 text-white border-brand-700 z-20': checked
          }">
          <span>HTTPS</span>
        </div>
      </RadioGroupOption>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'

type CloneUrlType = 'ssh' | 'https'

const starsStore = useStarsStore()

const currentUrlType: Ref<CloneUrlType> = ref('ssh')

const sshCloneUrl = computed(() => `git@github.com:${starsStore.selectedRepo?.nameWithOwner}.git`)
const httpsCloneUrl = computed(() => `${starsStore.selectedRepo?.url}.git`)

const cloneUrl = computed(() => {
  return currentUrlType.value === 'ssh' ? sshCloneUrl.value : httpsCloneUrl.value
})

const selectUrlText = (e: FocusEvent) => {
  (e?.currentTarget as HTMLInputElement)?.select()
}
</script>
