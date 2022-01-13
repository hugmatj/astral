<template>
  <Menu v-slot="{ open }" as="div" class="relative">
    <MenuButton
      class="inline-flex items-center text-gray-400 transition-colors hover:text-gray-200"
      :class="{ 'text-gray-50': open }"
    >
      <span class="text-xs tracking-wider uppercase">Sort</span>
      <SwitchVerticalIcon class="w-4 h-4 ml-1" />
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute z-20 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg right-2 sm:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                'group flex items-center p-2 text-xs w-full font-semibold',
              ]"
              @click="emit('sortTags', 'name', 'asc')"
            >
              <NameAZIcon class="w-4 h-4 mr-1 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
              <span>Alphabetical (A-Z)</span>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                'group flex items-center p-2 text-xs w-full font-semibold',
              ]"
              @click="emit('sortTags', 'name', 'desc')"
            >
              <NameZAIcon class="w-4 h-4 mr-1 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
              <span>Alphabetical (Z-A)</span>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                'group flex items-center p-2 text-xs w-full font-semibold',
              ]"
              @click="emit('sortTags', 'stars_count', 'desc')"
            >
              <StarsCountHighIcon class="w-4 h-4 mr-1 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
              <span>Most Stars</span>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                'group flex items-center p-2 text-xs w-full font-semibold',
              ]"
              @click="emit('sortTags', 'stars_count', 'asc')"
            >
              <StarsCountLowIcon class="w-4 h-4 mr-1 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
              <span>Fewest Stars</span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { SwitchVerticalIcon } from '@heroicons/vue/solid'
import { FetchDirection, TagSortMethod } from '@/types'
import NameAZIcon from '@/components/shared/icons/tag-sorting/NameAZIcon.vue'
import NameZAIcon from '@/components/shared/icons/tag-sorting/NameZAIcon.vue'
import StarsCountHighIcon from '@/components/shared/icons/tag-sorting/StarsCountHighIcon.vue'
import StarsCountLowIcon from '@/components/shared/icons/tag-sorting/StarsCountLowIcon.vue'

const emit = defineEmits<{
  (e: 'sortTags', method: TagSortMethod, direction: Lowercase<FetchDirection>): void
}>()
</script>
