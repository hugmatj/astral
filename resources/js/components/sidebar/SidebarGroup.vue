<template>
  <Disclosure v-slot="{ open }" as="div" :default-open="true">
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
    <DisclosurePanel v-show="open || !collapsible" static>
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
import { ChevronRightIcon as CaretIcon } from '@heroicons/vue/solid'
export default defineComponent({
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    CaretIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  }
})
</script>
