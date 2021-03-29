<template>
  <div
    class="absolute top-0 left-0 w-screen h-screen overflow-hidden bg-gray-50"
  >
    <div class="grid h-full dashboard-grid">
      <!-- Nav -->
      <div class="flex items-center px-4 bg-brand-600 col-span-full">
        <button
          class="inline-flex items-center justify-center w-6 h-6 text-white sm:hidden"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <svg
            class="flex-shrink-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>
      </div>
      <!-- Sidebar -->
      <div
        class="absolute inset-0 z-20 flex col-start-1 row-start-2 row-end-3 transition-opacity duration-300 ease-in-out bg-gray-900 sm:relative sm:pointer-events-auto"
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
          <Sidebar :tags="tags" @tag-selected="onTagSelected" />
        </div>
        <div v-show="isSidebarOpen" class="flex justify-center flex-grow pt-5">
          <button
            class="inline-flex items-center justify-center w-6 h-6 text-4xl text-white"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            &times;
          </button>
        </div>
      </div>
      <div
        class="col-span-1 row-start-2 row-end-3 overflow-y-auto border-r border-gray-300 sm:col-start-2"
      >
        <!-- Stars List -->
        <ul
          class="h-full col-start-2 row-start-3 row-end-4 bg-gray-200 divide-y divide-gray-300"
        >
          <li
            v-for="star in githubStars"
            :key="star.node.id"
            class="p-4 bg-white"
          >
            {{ star.node.nameWithOwner }}
          </li>
        </ul>
      </div>
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
          <svg
            class="flex-shrink-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { usePage } from "@inertiajs/inertia-vue3";
import { useTags } from "@/composables/useTags";
import { useGitHubStars } from "@/composables/useGitHubStars";
import Sidebar from "@/components/sidebar/Sidebar";

export default {
  components: {
    Sidebar,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
    errors: Object,
  },
  setup() {
    const user = computed(() => usePage().props.value.user);
    const { setSelectedTag } = useTags();
    const { githubStars, fetchStars } = useGitHubStars(user.value.access_token);
    const isSidebarOpen = ref(false);
    const isReadmeOpen = ref(false);

    const onTagSelected = (tag) => {
      isSidebarOpen.value = false;
      setSelectedTag(tag);
    };

    fetchStars();

    return { user, isSidebarOpen, isReadmeOpen, onTagSelected, githubStars };
  },
};
</script>

<style>
.dashboard-grid {
  grid-template-columns: 1fr;
  grid-template-rows: 48px 1fr;
}

@media screen and (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 280px 400px 1fr;
    grid-template-rows: 72px 1fr;
  }
}
</style>
