<template>
  <div
    class="fixed inset-0 bg-gray-900 flex items-center bg-repeat bg-[length:1000px_1000px]"
    :style="{ backgroundImage: 'url(/img/migrate-bg.svg)' }"
  >
    <div class="mx-auto w-full flex max-w-screen-lg justify-between">
      <MigrateAstronautSvg class="w-full max-w-xs motion-safe:animate-float h-auto" aria-hidden="true" />
      <div class="pl-24 space-y-8">
        <h2 class="font-bold text-white text-6xl shadow-[0_0_10px_10px_#111827] bg-gray-900 leading-tight">
          Welcome to the<br />new
          <LogoSvg class="h-6 sm:h-12 text-brand-500 fill-current inline-flex relative -top-1" aria-label="Astral" />
        </h2>
        <p class="text-white leading-loose shadow-[0_0_10px_10px_#111827] bg-gray-900">
          Before you get started we need to migrate some of your data to the new version. Depending on the number of
          stars you have, this could take from a few seconds to a couple minutes.
        </p>
        <div>
          <button
            type="button"
            class="bg-brand-600 rounded-full text-white font-bold px-6 py-4 text-2xl shadow-lg shadow-brand-900 hover:bg-brand-500 transition-all hover:shadow-brand-800 hover:shadow-xl relative active:top-px"
          >
            Begin Migration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { UserStar } from '@/types'
import LogoSvg from '@/../img/logo.svg?component'
import MigrateAstronautSvg from '@/../img/migrate-waving-astronaut.svg?component'

const props = defineProps({
  stars: {
    type: Array as PropType<UserStar[]>,
    required: true,
  },
})
</script>
