<template>
  <BaseDialog :is-open="isOpen" :hide="hide" modal-classes="px-4 pt-5 pb-4 sm:p-6 sm:max-w-3xl">
    <div>
      <DialogTitle class="px-4 py-3 text-xl font-bold text-center text-gray-700 rounded bg-gray-50"
        >Create Filter</DialogTitle
      >
      <div class="flex flex-col items-start w-1/2 pt-2 pb-8 mt-6">
        <label for="smart-filter-name" class="inline-block text-sm">Filter Name</label>
        <BaseTextInput
          id="smart-filter-name"
          v-model="smartFilter.name"
          class="w-full mt-2"
          placeholder="Give your filter a name..."
        ></BaseTextInput>
      </div>
      <div class="border-t border-gray-200">
        <SmartFilters v-model="smartFilter.body" />
      </div>
      <div class="flex justify-end pt-8">
        <BaseButton kind="primary">Save Filter</BaseButton>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import BaseDialog from '@/components/shared/core/BaseDialog.vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import { DialogTitle } from '@headlessui/vue'
import { useSmartFiltersDialog } from '@/composables/useSmartFiltersDialog'
import SmartFilters from '@/components/smart-filters/SmartFilters.vue'
import { defaultGroup } from '@/utils/predicates'
import cloneDeep from 'lodash/cloneDeep'
import { SmartFilter } from '@/types'

const { isOpen, hide } = useSmartFiltersDialog()

const smartFilter = reactive<SmartFilter>({
  name: '',
  body: JSON.stringify({
    groups: [cloneDeep(defaultGroup)],
  }),
})
</script>
