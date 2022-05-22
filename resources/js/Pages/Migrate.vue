<template>
  <div class="w-screen h-screen absolute inset-0 bg-gray-900">
    <Particles id="tsparticles" url="/particles-config.json" :particlesInit="particlesInit" />
    <!-- <div class="w-full max-w-5xl mx-auto mt-12"></div> -->
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { UserStar } from '@/types'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import { loadFull } from 'tsparticles'

const props = defineProps({
  stars: {
    type: Array as PropType<UserStar[]>,
    required: true,
  },
})

const particlesInit = async (engine) => {
  await loadFull(engine);
}
</script>
