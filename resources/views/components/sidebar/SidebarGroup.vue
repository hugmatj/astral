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

<template>
  <Disclosure v-slot="{ open }" as="div" :default-open="true">
    <div class="flex w-full items-center">
      <div class="flex items-center">
        <DisclosureButton
          class="flex items-center text-gray-500"
          :class="{ '-ml-1': collapsible }"
          :as="collapsible ? 'button' : 'h4'"
        >
          <CaretIcon
            v-if="collapsible"
            class="relative h-5 w-5 flex-shrink-0 transform"
            :class="{ 'rotate-90': open }"
            style="top: -1px"
            aria-hidden="true"
          />

          <span class="select-none text-xs font-bold uppercase tracking-wider">
            {{ title }}
          </span>
        </DisclosureButton>
      </div>

      <div
        class="ml-auto flex-shrink-0"
        :class="{
          'pointer-events-auto opacity-100': open || !collapsible,
          'pointer-events-none opacity-0': !open,
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
