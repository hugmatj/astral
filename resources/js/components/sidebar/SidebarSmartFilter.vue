<template>
  <SidebarItem
    :title="smartFilter.name"
    :is-active="false"
    :has-context-menu="true"
    :is-context-menu-active="isContextMenuActive"
    class="py-1 rounded-md group-one"
  >
    <template #icon>
      <FilterIcon />
    </template>

    <template #contextMenu>
      <div>
        <Menu v-slot="{ open }" as="div" class="relative">
          <WatchValue :value="open" @change="isContextMenuActive = !!$event" />
          <MenuButton
            class="top-0 right-0 w-5 h-5 text-gray-300 transition-opacity opacity-0 hover:text-gray-200 group-one-hover:opacity-100"
            :class="[open && 'opacity-100']"
          >
            <DotsHorizontalIcon />
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
              class="absolute z-20 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-28 right-2 sm:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                      'group-two flex items-center p-2 text-xs w-full font-semibold',
                    ]"
                    @click.stop=""
                  >
                    <PencilAltIcon
                      class="w-4 h-4 mr-1 text-gray-400 group-two-hover:text-indigo-500"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                      'group-two flex items-center p-2 text-xs w-full font-semibold',
                    ]"
                    @click.stop=""
                  >
                    <TrashIcon class="w-4 h-4 mr-1 text-gray-400 group-two-hover:text-indigo-500" aria-hidden="true" />
                    <span>Delete</span>
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </template>
  </SidebarItem>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import WatchValue from '@/components/shared/core/WatchValue.vue'
import { DotsHorizontalIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid'
import { FilterIcon } from '@heroicons/vue/outline'
import { SmartFilter } from '@/types'

const props = defineProps({
  smartFilter: {
    type: Object as PropType<SmartFilter>,
    required: true,
  },
})

const isContextMenuActive = ref(false)
</script>
