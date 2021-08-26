<template>
  <div
    class="absolute top-0 left-0 w-screen h-screen overflow-hidden bg-gray-50"
  >
    <SponsorshipDialog />
    <RenameTagDialog />
    <SettingsModal />
    <div class="grid h-screen dashboard-grid">
      <!-- Nav -->
      <div class="flex items-center px-4 bg-brand-600 col-span-full">
        <div class="flex items-center w-1/3 sm:hidden">
          <button
            class="inline-flex items-center justify-center w-6 h-6 text-white"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <MenuIcon />
          </button>
        </div>
        <div class="flex items-center flex-shrink-0 w-1/3">
          <img
            src="/images/logo.svg"
            alt="No Readme Selected"
            class="h-6 sm:h-8"
          />
        </div>
        <div class="flex justify-end w-1/3 sm:w-2/3">
          <UserMenu @show-settings="showSettingsModal"/>
        </div>
      </div>
      <!-- Sidebar -->
      <div
        class="absolute inset-0 z-20 flex col-start-1 row-start-2 row-end-3 transition-colors duration-300 ease-in-out bg-gray-900 sm:relative sm:pointer-events-auto backdrop-filter"
        :aria-hidden="!isSidebarOpen"
        :class="{
          'bg-opacity-0 pointer-events-none': !isSidebarOpen,
          'bg-opacity-75 backdrop-blur-sm': isSidebarOpen,
        }"
      >
        <div
          class="w-3/4 transition-transform duration-300 ease-in-out transform-gpu sm:translate-x-0 sm:w-full"
          :class="{
            '-translate-x-full': !isSidebarOpen,
            'translate-x-0': isSidebarOpen,
          }"
        >
          <Sidebar
            @all-stars-selected="onAllStarsSelected"
            @untagged-selected="onUntaggedSelected"
            @tag-selected="onTagSelected"
            @language-selected="onLanguageSelected"
          />
        </div>
        <div v-show="isSidebarOpen" class="flex justify-center flex-grow pt-5">
          <button
            class="inline-flex items-center justify-center w-10 h-10 text-4xl text-white"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <!-- Starred Repo List -->
      <div class="relative flex flex-col border-r border-gray-300">
      <Galileo />
      <StarredRepoList v-slot="{ repo }">
        <StarredRepo
          :repo="repo"
          @selected="onRepoSelected"
          @tag-selected="onTagSelected"
          @language-selected="onLanguageSelected"
        />
      </StarredRepoList>
      </div>
      <!-- Selected Star Info -->
      <div
        class="absolute inset-0 z-10 col-start-3 row-start-2 row-end-3 transition-transform duration-300 ease-in-out bg-white pointer-events-auto dark:bg-gray-900 transform-gpu sm:translate-x-0 sm:relative"
        :class="{
          'translate-x-full pointer-events-none': !isReadmeOpen,
          'translate-x-0': isReadmeOpen,
        }"
      >
        <!-- <button
          class="absolute top-0 left-0 z-10 inline-flex items-center justify-center w-6 h-6 mt-5 ml-5 text-gray-700 rounded-full bg-gray-50 sm:hidden"
          @click="isReadmeOpen = false"
        >
          <ArrowCircleLeftIcon />
        </button> -->
        <div class="relative flex flex-col h-full">
          <RepoToolbar v-if="isAnyRepoSelected" />
          <Readme />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType, computed } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import { useAuthorizationsStore } from '@/store/useAuthorizationsStore'
import { useTagsStore } from '@/store/useTagsStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import { useSyncValueToStore } from '@/composables/useSyncValueToStore'
import { useListSelectionState } from '@/composables/useListSelectionState'
import { useSponsorshipDialog } from '@/composables/useSponsorshipDialog'
import { useSettingsModal } from '@/composables/useSettingsModal'
import { useUrlParams } from '@/composables/useUrlParams'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import StarredRepoList from '@/components/stars/StarredRepoList.vue'
import StarredRepo from '@/components/stars/StarredRepo.vue'
import RepoToolbar from '@/components/toolbar/RepoToolbar.vue'
import Readme from '@/components/readme/Readme.vue'
import SponsorshipDialog from '@/components/shared/dialogs/SponsorshipDialog.vue'
import RenameTagDialog from '@/components/shared/dialogs/RenameTagDialog.vue'
import UserMenu from '@/components/UserMenu.vue'
import Galileo from '@/components/Galileo.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import { GitHubRepo, Tag, UserStar, User, Abilities, AbilityContext, Limits, } from '@/types'
import {
  // ArrowCircleLeftIcon,
  XCircleIcon as CloseIcon,
  MenuAlt1Icon as MenuIcon,
} from '@heroicons/vue/outline'

export default defineComponent({
  components: {
    Sidebar,
    StarredRepoList,
    StarredRepo,
    RepoToolbar,
    Readme,
    SponsorshipDialog,
    RenameTagDialog,
    UserMenu,
    // ArrowCircleLeftIcon,
    CloseIcon,
    MenuIcon,
    Galileo,
    SettingsModal,
  },
  props: {
    tags: {
      type: Array as PropType<Tag[]>,
      required: true,
    },
    stars: {
      type: Array as PropType<UserStar[]>,
      required: true,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    abilities: {
      type: Object as PropType<Abilities>,
      required: true,
    },
    limits: {
      type: Object as PropType<Limits>,
      required: true,
    },
    flash: {
      type: Object as PropType<Record<string, AbilityContext>>,
      required: true,
    },
    errors: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const userStore = useUserStore()
    const authorizationsStore = useAuthorizationsStore()
    const tagsStore = useTagsStore()
    const starsStore = useStarsStore()
    const starsFilterStore = useStarsFilterStore()
    const { showDialog } = useSponsorshipDialog()
    const { showSettingsModal } = useSettingsModal()
    const { params: urlParams, clearParams } = useUrlParams()

    const flash = computed(() => props.flash)

    useSyncValueToStore(computed(() => props.user), userStore, 'user')
    useSyncValueToStore(computed(() => props.abilities), authorizationsStore, 'abilities')
    useSyncValueToStore(computed(() => props.limits), authorizationsStore, 'limits')
    useSyncValueToStore(computed(() => props.tags), tagsStore, 'tags')
    useSyncValueToStore(computed(() => props.stars), starsStore, 'userStars')

    const { selectItem, selectedItems } = useListSelectionState(computed(() => starsStore.starredRepos.map(repo => repo.node)))

    /**
     * After each request finishes we check the session to see if
     * the user attempted to do something that requires an active
     * sponsorship. If true, show them the Sponsor dialog.
     */
    Inertia.on('finish', () => {
      if (flash.value.sponsorship_required) {
        showDialog(flash.value.sponsorship_required)
      }
    })

    const isSidebarOpen = ref(false)
    const isReadmeOpen = ref(false)

    const onAllStarsSelected = () => {
      isSidebarOpen.value = false
      starsFilterStore.setFilterByAll()
      clearParams()
    }

    const onUntaggedSelected = () => {
      isSidebarOpen.value = false
      starsFilterStore.setFilterByUntagged()
      clearParams()
    }

    const onTagSelected = (tag: Tag) => {
      isSidebarOpen.value = false
      starsFilterStore.selectedTag = tag
      urlParams.tag = tag.name
    }

    const onLanguageSelected = (language: string) => {
      isSidebarOpen.value = false
      starsFilterStore.selectedLanguage = language
      urlParams.language = language
    }

    const onRepoSelected = (repo: GitHubRepo) => {
      isReadmeOpen.value = true
      selectItem(repo.node)
    }

    watch(selectedItems, repos => {
      starsStore.selectedRepos = repos
    })

    watch(urlParams, (params) => {
      if (params.tag) {
        const tag = tagsStore.tags.find(tag => tag.name === params.tag)

        if (tag) {
          starsFilterStore.selectedTag = tag
        }
      }

      if (params.language) {
        starsFilterStore.selectedLanguage = params.language
      }
    }, { immediate: true })

    return {
      isSidebarOpen,
      isReadmeOpen,
      onAllStarsSelected,
      onUntaggedSelected,
      onTagSelected,
      onLanguageSelected,
      onRepoSelected,
      isAnyRepoSelected: computed(() => starsStore.isAnyRepoSelected),
      showSettingsModal,
    }
  },
})
</script>

<style>
.dashboard-grid {
  grid-template-columns: 1fr;
  grid-template-rows: 48px calc(100vh - 48px);
}

@media screen and (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 280px 400px 1fr;
    grid-template-rows: 64px calc(100vh - 64px);
  }
}
</style>
