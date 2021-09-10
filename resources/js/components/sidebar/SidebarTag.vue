<template>
  <SidebarItem
    :title="tag.name"
    :count="tag.stars_count"
    :is-active="isActive"
    :is-highlighted="isHighlighted"
    :has-context-menu="true"
    class="py-1 rounded-md sidebar-tag"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <template #icon>
      <TagIcon />
    </template>

    <template #contextMenu>
      <div :class="[tag.stars_count && 'absolute top-0 right-0']">
        <Menu v-slot="{ open }" as="div" class="relative">
          <MenuButton
            class="top-0 right-0 w-5 h-5 text-gray-300 opacity-0 hover:text-gray-200 group-hover:opacity-100 group-focus-within:opacity-100" :class="[open && 'opacity-100']">
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
            class="absolute z-20 w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg right-2 sm:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'group flex items-center px-4 py-2 text-xs w-full',
                    ]"
                    @click.stop="showDialog(tag)"
                  >
                    <PencilAltIcon
                      class="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span>Rename</span>
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                      'group flex items-center px-4 py-2 text-xs w-full',
                    ]"
                    @click.stop="deleteTag"
                  >
                    <TrashIcon
                      class="w-4 h-4 mr-2 text-red-400 group-hover:text-red-500"
                      aria-hidden="true"
                    />
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

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { TagIcon } from '@heroicons/vue/outline'
import { DotsHorizontalIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid'
import { useStarsStore } from '@/store/useStarsStore'
import { useTagsStore } from '@/store/useTagsStore'
import { useRenameTagDialog } from '@/composables/useRenameTagDialog'
import { Tag } from '@/types'

export default defineComponent({
  components: {
    SidebarItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TagIcon,
    DotsHorizontalIcon,
    PencilAltIcon,
    TrashIcon,
  },
  props: {
    tag: {
      type: Object as PropType<Tag>,
      required: true,
    },
    isActive: Boolean,
  },
  emits: ['stars-dropped'],
  setup(props, { emit }) {
    const isHighlighted = ref(false)

    const starsStore = useStarsStore()
    const tagsStore = useTagsStore()
    const { showDialog } = useRenameTagDialog()

    const onDragOver = (e: DragEvent) => {
      e.preventDefault()

      if (starsStore.isDraggingRepo) {
        isHighlighted.value = true
      }
    }
    const onDragLeave = () => (isHighlighted.value = false)

    const onDrop = (e: DragEvent) => {
      if (starsStore.isDraggingRepo && starsStore.draggingRepos.length) {
        emit('stars-dropped', {
          tag: props.tag,
          repoIds: starsStore.draggingRepos.map(repo => repo.databaseId),
        })
        isHighlighted.value = false
      }

      e.preventDefault()
    }

    const deleteTag = () => {
      if (confirm(`Are you sure you want to delete the "${props.tag.name}" tag?`)) {
        tagsStore.deleteTag(props.tag.id)
      }
    }

    return {
      onDragOver,
      onDragLeave,
      onDrop,
      isHighlighted,
      showDialog,
      deleteTag,
    }
  },
})
</script>

<style></style>
