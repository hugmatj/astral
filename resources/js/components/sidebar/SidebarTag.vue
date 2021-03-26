<template>
  <SidebarItem
    :title="tag.name"
    :count="0"
    :is-active="isActive"
    :is-highlighted="isHighlighted"
    class="py-1 rounded-md"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    </template>
  </SidebarItem>
</template>

<script>
import SidebarItem from "@/components/sidebar/SidebarItem";
export default {
  components: {
    SidebarItem,
  },
  props: {
    tag: {
      type: Object,
      required: true,
    },
    isActive: Boolean,
  },
  data() {
    return {
      isHighlighted: false,
    };
  },
  emits: ["star-dropped"],
  methods: {
    onDragOver(e) {
      e.preventDefault();
      this.isHighlighted = true;
    },
    onDragLeave() {
      this.isHighlighted = false;
    },
    onDrop(e) {
      // const star = JSON.parse(e.dataTransfer.getData("text/plain"));
      // this.$emit("star-dropped", { tag: this.tag, starId: star.id });
      // this.isHighlighted = false;
      e.preventDefault();
    },
  },
};
</script>

<style></style>
