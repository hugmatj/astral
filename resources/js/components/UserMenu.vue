<template>
  <Menu v-if="user" v-slot="{ open }" as="div" class="relative -mr-4 sm:mr-0">
    <div>
      <MenuButton class="flex items-center py-1 pl-2 pr-2 text-white transition-colors sm:pl-1 sm:rounded-md sm:hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-600 focus:ring-brand-800" :class="{ 'bg-brand-800': open }">
        <img :src="user.avatar" :alt="user.username" class="w-10 h-10 rounded-md image-rendering-crisp" />
        <span class="hidden ml-2 text-sm font-semibold sm:inline-block">{{ user.username }}</span>
        <SelectorIcon class="flex-shrink-0 w-5 h-5 ml-1" aria-hidden="true" />
      </MenuButton>
    </div>
    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
      <MenuItems class="absolute z-20 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg right-2 sm:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Settings</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="https://github.com/sponsors/syropian" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Become a Sponsor</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="https://github.com/astralapp/astral" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">View on GitHub</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="https://github.com/astralapp/astral/discussions" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Discussions</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="https://github.com/astralapp/astral/issues" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">File an Issue</a>
          </MenuItem>
        </div>
      </MenuItems>
      </transition>
  </Menu>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { SelectorIcon } from '@heroicons/vue/solid'
import { useUserStore } from '@/store/useUserStore'
export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    SelectorIcon,
  },
  setup(){
    const userStore = useUserStore()

    return {
      user: computed(() => userStore.user)
    }
  }
})
</script>
