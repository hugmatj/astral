<template>
  <div
    class="absolute top-0 left-0 w-screen h-screen overflow-hidden bg-gray-50"
  >
    <div class="grid h-screen dashboard-grid">
      <!-- Nav -->
      <div class="flex items-center px-4 bg-brand-600 col-span-full">
        <button
          class="inline-flex items-center justify-center w-6 h-6 text-white sm:hidden"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <MenuIcon />
        </button>
      </div>
      <!-- Sidebar -->
      <div
        class="absolute inset-0 z-20 flex col-start-1 row-start-2 row-end-3 transition-colors duration-300 ease-in-out bg-gray-900 sm:relative sm:pointer-events-auto"
        :aria-hidden="!isSidebarOpen"
        :class="{
          'bg-opacity-0 pointer-events-none': !isSidebarOpen,
          'bg-opacity-75': isSidebarOpen,
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
      <StarredRepoList v-slot="{ repo }">
        <StarredRepo
          :repo="repo"
          @selected="onRepoSelected(repo)"
          @tag-selected="onTagSelected"
        />
      </StarredRepoList>
      <!-- Selected Star Info -->
      <div
        class="absolute inset-0 z-10 col-start-3 row-start-2 row-end-3 transition-transform duration-300 ease-in-out bg-white pointer-events-auto transform-gpu sm:translate-x-0 sm:relative"
        :class="{
          'translate-x-full pointer-events-none': !isReadmeOpen,
          'translate-x-0': isReadmeOpen,
        }"
      >
        <button
          class="absolute top-0 left-0 z-10 inline-flex items-center justify-center w-6 h-6 mt-5 ml-5 text-gray-700 bg-white rounded-full sm:hidden"
          @click="isReadmeOpen = false"
        >
          <ArrowCircleLeftIcon />
        </button>
        <Readme />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { useTagsStore } from '@/store/useTagsStore'
import { useStarsStore } from '@/store/useStarsStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import { useSyncValueToStore } from '@/composables/useSyncValueToStore'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import StarredRepoList from '@/components/stars/StarredRepoList.vue'
import StarredRepo from '@/components/stars/StarredRepo.vue'
import Readme from '@/components/readme/Readme.vue'
import { GitHubRepo, Tag, UserStar, User } from '@/types'
import {
  ArrowCircleLeftIcon,
  XCircleIcon as CloseIcon,
  MenuAlt1Icon as MenuIcon,
} from '@heroicons/vue/outline'

export default defineComponent({
  components: {
    Sidebar,
    StarredRepoList,
    StarredRepo,
    Readme,
    ArrowCircleLeftIcon,
    CloseIcon,
    MenuIcon,
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
    errors: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const userStore = useUserStore()
    const tagsStore = useTagsStore()
    const starsStore = useStarsStore()
    const starsFilterStore = useStarsFilterStore()

    useSyncValueToStore(() => props.user, userStore, 'user')
    useSyncValueToStore(() => props.tags, tagsStore, 'tags')
    useSyncValueToStore(() => props.stars, starsStore, 'userStars')

    const isSidebarOpen = ref(false)
    const isReadmeOpen = ref(false)

    const onTagSelected = (tag: Tag) => {
      isSidebarOpen.value = false
      starsFilterStore.selectedTag = tag
    }

    const onLanguageSelected = (language: string) => {
      isSidebarOpen.value = false
      starsFilterStore.selectedLanguage = language
    }

    const onRepoSelected = (repo: GitHubRepo) => {
      isReadmeOpen.value = true
      starsStore.selectedRepo = repo.node
    }

    return {
      isSidebarOpen,
      isReadmeOpen,
      onTagSelected,
      onLanguageSelected,
      onRepoSelected,
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
    grid-template-rows: 72px calc(100vh - 72px);
  }
}
</style>
