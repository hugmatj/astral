<template>
  <ActionDialog :is-open="isOpen" :hide="hide">
    <template #icon>
      <div class="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full">
        <ExclamationIcon class="w-6 h-6 text-yellow-800" aria-hidden="true" /></div
    ></template>
    <template #title>Elevated Privileges Required</template>
    <template #body>
      <p class="leading-relaxed text-gray-500">
        Unstarring repositories requires your authorization scope to be upgraded from
        <code
          class="inline-flex items-center py-0.5 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800 px-1.5"
          >read:user</code
        >
        to
        <code
          class="inline-flex items-center px-1.5 py-0.5 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800"
          >public_repo</code
        >. If you would like to learn more about authorization scopes, you can consult the
        <a
          href="https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-gray-800 underline focus-within:outline-none"
          >official GitHub documentation</a
        >.
      </p>
    </template>
    <template #actions>
      <BaseButton class="w-full" @click="hide"> Nevermind </BaseButton>
      <BaseButton kind="warning" class="w-full" @click="redirectToGitHub">Grant Access</BaseButton>
    </template>
  </ActionDialog>
</template>

<script setup>
import { useUpgradeAuthScopeDialog } from '@/composables/useUpgradeAuthScopeDialog'
import { ExclamationIcon } from '@heroicons/vue/outline'
import ActionDialog from '@/components/shared/core/ActionDialog.vue'
import BaseButton from '@/components/shared//core/BaseButton.vue'

const { isOpen, hide, redirectToGitHub } = useUpgradeAuthScopeDialog()
</script>
