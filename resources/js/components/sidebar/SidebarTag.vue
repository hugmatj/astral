<template>
  <SidebarItem
    :title="tag.name"
    :count="tag.stars_count"
    :is-active="isActive"
    :is-highlighted="isHighlighted"
    :has-context-menu="true"
    :is-context-menu-active="isContextMenuActive"
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
          <WatchValue :value="open" @change="isContextMenuActive = !!$event" />
          <MenuButton
            class="top-0 right-0 w-5 h-5 text-gray-300 transition-opacity opacity-0 hover:text-gray-200 group-hover:opacity-100"
            :class="[open && 'opacity-100']"
            @click.stop=""
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
                      'group-one flex items-center p-2 text-xs w-full font-semibold',
                    ]"
                    @click.stop="showRenameTagDialog(tag)"
                  >
                    <PencilAltIcon
                      class="w-4 h-4 mr-1 text-gray-400 group-one-hover:text-indigo-500"
                      aria-hidden="true"
                    />
                    <span>Rename</span>
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                      'group-one flex items-center p-2 text-xs w-full font-semibold',
                    ]"
                    @click.stop="deleteTag"
                  >
                    <TrashIcon class="w-4 h-4 mr-1 text-gray-400 group-one-hover:text-indigo-500" aria-hidden="true" />
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
import WatchValue from '@/components/shared/core/WatchValue.vue'
import { TagIcon } from '@heroicons/vue/outline'
import { DotsHorizontalIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid'
import { useStarsStore } from '@/store/useStarsStore'
import { useTagsStore } from '@/store/useTagsStore'
import { useRenameTagDialog } from '@/composables/useRenameTagDialog'
import { useGlobalToast } from '@/composables/useGlobalToast'
import { useConfirm } from '@/composables/useConfirm'
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
    WatchValue,
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
    const isContextMenuActive = ref(false)

    const starsStore = useStarsStore()
    const tagsStore = useTagsStore()
    const { show: showRenameTagDialog } = useRenameTagDialog()
    const { show: showToast } = useGlobalToast()
    const { isConfirmed } = useConfirm()

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
          repos: starsStore.draggingRepos.map(({ databaseId, nameWithOwner, url, description }) => ({
            databaseId,
            nameWithOwner,
            url,
            description,
          })),
        })
        isHighlighted.value = false
      }

      e.preventDefault()
    }

    const deleteTag = async () => {
      if (
        await isConfirmed(`Are you sure you want to delete the "${props.tag.name}" tag?`, {
          confirmLabel: "Yes, I'm sure",
          cancelLabel: 'Nevermind',
        })
      ) {
        tagsStore.deleteTag(props.tag.id)
        showToast(`The ${props.tag.name} tag was deleted.`)
      }
    }

    return {
      onDragOver,
      onDragLeave,
      onDrop,
      isHighlighted,
      showRenameTagDialog,
      deleteTag,
      isContextMenuActive,
    }
  },
})
</script>

<style></style>
