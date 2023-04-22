<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue'
import { router } from '@inertiajs/vue3'
import { Errors } from '@inertiajs/core'
import { useUserStore } from '@/scripts/store/useUserStore'
import { useAuthorizationsStore } from '@/scripts/store/useAuthorizationsStore'
import { useTagsStore } from '@/scripts/store/useTagsStore'
import { useStarsStore } from '@/scripts/store/useStarsStore'
import { useStarsFilterStore } from '@/scripts/store/useStarsFilterStore'
import { useSmartFiltersStore } from '@/scripts/store/useSmartFiltersStore'
import { useSyncValuesToStores } from '@/scripts/composables/useSyncValuesToStores'
import { useListSelectionState } from '@/scripts/composables/useListSelectionState'
import { useSponsorshipDialog } from '@/scripts/composables/useSponsorshipDialog'
import { useSettingsDialog } from '@/scripts/composables/useSettingsDialog'
import { useUrlParams } from '@/scripts/composables/useUrlParams'
import Sidebar from '@/views/components/sidebar/Sidebar.vue'
import StarredRepoList from '@/views/components/stars/StarredRepoList.vue'
import StarredRepo from '@/views/components/stars/StarredRepo.vue'
import RepoToolbar from '@/views/components/toolbar/RepoToolbar.vue'
import NotesEditor from '@/views/components/notes-editor/NotesEditor.vue'
import Readme from '@/views/components/readme/Readme.vue'
import SponsorshipDialog from '@/views/components/shared/dialogs/SponsorshipDialog.vue'
import RenameTagDialog from '@/views/components/shared/dialogs/RenameTagDialog.vue'
import UpgradeOAuthScopeDialog from '@/views/components/shared/dialogs/UpgradeAuthScopeDialog.vue'
import SmartFiltersDialog from '@/views/components/shared/dialogs/SmartFilterDialog.vue'
import ConfirmDialog from '@/views/components/shared/dialogs/ConfirmDialog.vue'
import WelcomeDialog from '@/views/components/shared/dialogs/WelcomeDialog.vue'
import UserMenu from '@/views/components/UserMenu.vue'
import Galileo from '@/views/components/Galileo.vue'
import SettingsDialog from '@/views/components/shared/dialogs/SettingsDialog.vue'
import GlobalToast from '@/views/components/GlobalToast.vue'
import { GitHubRepo, Tag, UserStar, User, Ability, Limits, Authorizations, SmartFilter } from '@/scripts/types'
import { ArrowCircleLeftIcon, XCircleIcon as CloseIcon, MenuAlt1Icon as MenuIcon } from '@heroicons/vue/outline'
import LogoSvg from '../../img/logo.svg?component'
import { tryOnMounted } from '@vueuse/core'
import localForage from 'localforage'

interface Props {
  user: User
  tags: Tag[]
  stars: UserStar[]
  smartFilters: SmartFilter[]
  abilities: Authorizations
  limits: Limits
  errors: Errors
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({} as Errors),
})

const userStore = useUserStore()
const authorizationsStore = useAuthorizationsStore()
const tagsStore = useTagsStore()
const starsStore = useStarsStore()
const starsFilterStore = useStarsFilterStore()
const smartFiltersStore = useSmartFiltersStore()
const { show: showSponsorshipDialog } = useSponsorshipDialog()
const { show: showSettingsDialog } = useSettingsDialog()
const { params: urlParams, clearParams } = useUrlParams()

useSyncValuesToStores(
  [userStore, 'user', computed(() => props.user)],
  [authorizationsStore, 'abilities', computed(() => props.abilities)],
  [authorizationsStore, 'limits', computed(() => props.limits)],
  [tagsStore, 'tags', computed(() => props.tags)],
  [starsStore, 'userStars', computed(() => props.stars)],
  [smartFiltersStore, 'smartFilters', computed(() => props.smartFilters)]
)

const isStarsListFocused = ref(false)

const { selectItem, selectedItems } = useListSelectionState(
  computed(() => starsStore.filteredRepos.map(repo => repo.node)),
  isStarsListFocused
)

/**
 * After each request finishes we check the session to see if
 * the user attempted to do something that requires an active
 * sponsorship. If true, show them the Sponsor dialog.
 */
router.on('finish', () => {
  if (props.errors.sponsorship_required) {
    showSponsorshipDialog(props.errors.sponsorship_required as Ability)
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
  starsFilterStore.setSelectedTag(tag)
  urlParams.smartFilter = null
  urlParams.tag = tag.name
}

const onSmartFilterSelected = (smartFilter: SmartFilter) => {
  isSidebarOpen.value = false
  starsFilterStore.setSelectedSmartFilter(smartFilter)
  clearParams()
  urlParams.smartFilter = smartFilter.name
}

const onLanguageSelected = (language: string) => {
  isSidebarOpen.value = false
  starsFilterStore.setSelectedLanguage(language)
  urlParams.smartFilter = null
  urlParams.language = language
}

const onRepoSelected = (repo: GitHubRepo) => {
  isReadmeOpen.value = true
  selectItem(repo.node)
}

const onReloadStars = async () => {
  await localForage.clear()
  starsStore.resetPageInfo()
  starsStore.clearStarredRepos()

  await nextTick()

  while (starsStore.pageInfo.hasNextPage) {
    const { viewer } = await starsStore.fetchStars(starsStore.pageInfo.endCursor)

    starsStore.totalRepos = viewer.starredRepositories.totalCount
    starsStore.pageInfo = viewer.starredRepositories.pageInfo

    starsStore.starredRepos = starsStore.starredRepos.concat(viewer.starredRepositories.edges)
  }

  starsStore.isFetchingStars = false
}

watch(selectedItems, repos => {
  starsStore.selectedRepos = repos
})

watch(
  urlParams,
  params => {
    if (params.tag) {
      const tag = tagsStore.tags.find(tag => tag.name === params.tag)

      if (tag) {
        starsFilterStore.selectedTag = tag
      }
    }

    if (params.language) {
      starsFilterStore.selectedLanguage = params.language
    }
  },
  { immediate: true }
)

// Show welcome dialog the first time a user logs in
const shouldShowWelcomeMessage = ref(false)
tryOnMounted(() => {
  shouldShowWelcomeMessage.value = !props.user.flags.find(flag => flag.key === 'has-seen-welcome-message')?.value
})
</script>

<template>
  <div class="absolute left-0 top-0 h-screen w-screen overflow-hidden bg-gray-50">
    <div class="dashboard-grid grid h-screen">
      <!-- Nav -->
      <div
        class="col-span-full flex items-center bg-brand-600 px-4 transition-transform duration-300"
        :class="{
          'translate-x-8': isSidebarOpen,
        }"
      >
        <div class="flex w-1/3 items-center sm:hidden">
          <button
            class="inline-flex h-6 w-6 items-center justify-center text-white"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <MenuIcon />
          </button>
        </div>

        <div class="flex w-1/3 flex-shrink-0 items-center justify-start">
          <LogoSvg class="h-6 fill-current text-white sm:h-8" aria-label="Astral" />
        </div>

        <div class="flex w-1/3 justify-end sm:w-2/3">
          <UserMenu @show-settings="showSettingsDialog" />
        </div>
      </div>

      <!-- Sidebar -->
      <div
        class="absolute inset-0 z-20 col-start-1 row-start-2 row-end-3 flex bg-gray-900 backdrop-filter transition-colors duration-300 ease-in-out sm:pointer-events-auto sm:relative"
        :aria-hidden="!isSidebarOpen"
        :class="{
          'pointer-events-none bg-opacity-0': !isSidebarOpen,
          'bg-opacity-75 backdrop-blur-sm': isSidebarOpen,
        }"
      >
        <div
          class="w-3/4 transform-gpu transition-transform duration-300 ease-in-out sm:w-full sm:translate-x-0"
          :class="{
            '-translate-x-full': !isSidebarOpen,
            'translate-x-0': isSidebarOpen,
          }"
        >
          <Sidebar
            @all-stars-selected="onAllStarsSelected"
            @untagged-selected="onUntaggedSelected"
            @tag-selected="onTagSelected"
            @smart-filter-selected="onSmartFilterSelected"
            @language-selected="onLanguageSelected"
            @reload-stars="onReloadStars"
          />
        </div>

        <button
          v-show="isSidebarOpen"
          class="flex flex-grow justify-center pt-5"
          aria-label="Close Sidebar"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <div class="inline-flex h-10 w-10 items-center justify-center text-4xl text-white" aria-hidden="true">
            <CloseIcon />
          </div>
        </button>
      </div>

      <!-- Starred Repo List -->
      <div
        class="relative flex flex-col border-r border-gray-300 transition-transform duration-300 dark:border-gray-600"
        :class="{
          'translate-x-8': isSidebarOpen,
        }"
      >
        <Galileo />

        <StarredRepoList
          v-slot="{ repo }"
          class="focus:outline-none"
          @focus="isStarsListFocused = true"
          @blur="isStarsListFocused = false"
        >
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
        class="pointer-events-auto absolute inset-0 z-10 col-start-3 row-start-2 row-end-3 transform-gpu bg-white transition-transform duration-300 ease-in-out dark:bg-gray-900 sm:relative sm:translate-x-0"
        :class="{
          'pointer-events-none translate-x-full': !isReadmeOpen,
          'translate-x-0': isReadmeOpen,
        }"
      >
        <button
          class="absolute left-0 top-0 z-10 ml-5 mt-20 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 text-gray-700 sm:hidden"
          @click="isReadmeOpen = false"
        >
          <ArrowCircleLeftIcon />
        </button>

        <div class="relative flex h-full flex-col">
          <RepoToolbar v-if="starsStore.isAnyRepoSelected" />

          <Readme />

          <NotesEditor v-if="starsStore.isAnyRepoSelected" is-open />
        </div>
      </div>
    </div>

    <SponsorshipDialog />

    <RenameTagDialog />

    <SettingsDialog />

    <UpgradeOAuthScopeDialog />

    <SmartFiltersDialog />

    <WelcomeDialog :is-open="shouldShowWelcomeMessage" :hide="() => (shouldShowWelcomeMessage = false)" />

    <GlobalToast />

    <ConfirmDialog />
  </div>
</template>

<style>
.dashboard-grid {
  grid-template-columns: 1fr;
  grid-template-rows: 48px calc(100vh - 48px);
}

@media screen and (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 320px 400px 1fr;
    grid-template-rows: 64px calc(100vh - 64px);
  }
}
</style>
