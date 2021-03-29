<template>
  <div class="h-full p-4 bg-gray-900">
    <div class="mt-6 space-y-6">
      <SidebarGroup title="Tags" collapsible class="relative">
        <form class="mt-2" @submit.prevent="addTag">
          <input
            v-model="addTagForm.name"
            type="text"
            placeholder="Add a tag..."
            class="w-full border-0 rounded-lg focus:ring-2 focus:ring-gray-500"
          />
        </form>
        <ul class="mt-2"></ul>
        <transition-group
          enter-active-class="transform-gpu"
          enter-from-class="-translate-x-full opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="absolute transform-gpu"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="-translate-x-full opacity-0"
        >
          <SidebarTag
            v-for="tag in tags"
            :key="tag.id"
            :tag="tag"
            :is-active="tagIsSelected(tag)"
            @star-dropped="onStarDropped"
            @click="$emit('tag-selected', tag)"
            class="transition-all duration-300"
          >
          </SidebarTag>
        </transition-group>
      </SidebarGroup>
    </div>
  </div>
</template>

<script>
import { useTags } from "@/composables/useTags";
import SidebarGroup from "@/components/sidebar/SidebarGroup";
import SidebarTag from "@/components/sidebar/SidebarTag";
export default {
  components: {
    SidebarGroup,
    SidebarTag,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
  emits: ["tag-selected"],
  setup() {
    const { selectedTag, addTagForm, addTag } = useTags();

    const onStarDropped = (star) => console.log(star);

    const tagIsSelected = (tag) => tag.id === selectedTag.value?.id;

    return { tagIsSelected, addTagForm, addTag, onStarDropped };
  },
};
</script>

<style></style>
