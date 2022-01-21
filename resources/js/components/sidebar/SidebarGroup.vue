<template>
  <Disclosure v-slot="{ open }" as="div" :default-open="true">
    <div class="flex items-center w-full">
      <div class="flex items-center">
        <DisclosureButton
          class="flex items-center text-gray-500"
          :class="{ '-ml-1': collapsible }"
          :as="collapsible ? 'button' : 'h4'"
        >
          <CaretIcon
            v-if="collapsible"
            class="relative flex-shrink-0 w-5 h-5 transform"
            :class="{ 'rotate-90': open }"
            style="top: -1px"
            aria-hidden="true"
          />
          <span class="text-xs font-bold tracking-wider uppercase select-none">
            {{ title }}
          </span>
        </DisclosureButton>
      </div>
      <div
        class="flex-shrink-0 ml-auto"
        :class="{
          'opacity-100 pointer-events-auto': open || !collapsible,
          'opacity-0 pointer-events-none': !open,
        }"
      >
        <slot name="right-action"></slot>
      </div>
    </div>
    <DisclosurePanel v-show="open || !collapsible" static>
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronRightIcon as CaretIcon } from '@heroicons/vue/solid'

defineProps({
  title: {
    type: String,
    required: true,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
})
</script>
