<template>
  <BaseDialog :is-open="isOpen" :hide="hideDialog" modal-classes="px-4 pt-5 pb-4 sm:p-6 sm:max-w-3xl">
    <div>
      <DialogTitle class="px-4 py-3 text-xl font-bold text-center text-gray-700 rounded bg-gray-50"
        >{{ currentSmartFilter ? 'Update' : 'Create' }} Filter</DialogTitle
      >
      <form @submit.prevent="currentSmartFilter ? updateSmartFilter() : addSmartFilter()">
        <div class="flex flex-col items-start w-1/2 pt-2 pb-8 mt-6">
          <label for="smart-filter-name" class="inline-block text-sm">Filter Name</label>
          <BaseTextInput
            id="smart-filter-name"
            v-model="form.name"
            class="w-full mt-2"
            placeholder="Give your filter a name..."
          ></BaseTextInput>
        </div>
        <div ref="smartFiltersContainer" class="border-t border-gray-200 max-h-[62vh] overflow-y-auto">
          <SmartFilterEditor v-model="form.body" />
          <div ref="scrollTarget" class="scroll-target" aria-hidden="true"></div>
        </div>
        <div class="flex items-center justify-end px-4 py-3 mt-4 space-x-2 rounded bg-gray-50">
          <BaseButton kind="base" @click="hideDialog">Cancel</BaseButton>
          <BaseButton kind="primary" type="submit">Save Filter</BaseButton>
        </div>
      </form>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { watch, ref, nextTick } from 'vue'
import BaseDialog from '@/components/shared/core/BaseDialog.vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import { DialogTitle } from '@headlessui/vue'
import { useSmartFilterDialog } from '@/composables/useSmartFilterDialog'
import SmartFilterEditor from '@/components/smart-filter-editor/SmartFilterEditor.vue'
import { defaultGroup } from '@/utils/predicates'
import { useSmartFiltersStore } from '@/store/useSmartFiltersStore'
import { useForm } from '@inertiajs/inertia-vue3'
import cloneDeep from 'lodash/cloneDeep'
import { SmartFilter } from '@/types'
import { useGlobalToast, ToastType } from '@/composables/useGlobalToast'
import { SPONSORSHIP_REQUIRED_ERROR } from '@/constants'
import { Errors } from '@inertiajs/inertia'

const smartFiltersStore = useSmartFiltersStore()

const { isOpen, hide, currentSmartFilter } = useSmartFilterDialog()
const { show: showToast } = useGlobalToast()
const scrollTarget = ref<HTMLElement>()

const form = useForm<Pick<SmartFilter, 'name' | 'body'>>({
  name: '',
  body: JSON.stringify({
    groups: [cloneDeep(defaultGroup)],
  }),
})

watch(currentSmartFilter, smartFilter => {
  if (smartFilter) {
    form.name = smartFilter.name
    form.body = smartFilter.body
  }
})

watch(
  () => form.body,
  async () => {
    if (scrollTarget.value) {
      await nextTick()
      scrollTarget.value.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }
)

const addSmartFilter = async () => {
  try {
    await smartFiltersStore.addSmartFilter(form)
    showToast(`The '${form.name}' smart filter was added.`)
  } catch (e) {
    const errors = e as Errors
    if (!errors[SPONSORSHIP_REQUIRED_ERROR]) {
      showToast(errors[Object.keys(errors)[0]], ToastType.Error)
    }
  } finally {
    hideDialog()
  }
}

const updateSmartFilter = async () => {
  try {
    if (currentSmartFilter.value) {
      await smartFiltersStore.updateSmartFilter(currentSmartFilter.value.id, form)
      showToast(`The '${form.name}' smart filter was updated.`)
    }
  } catch (e) {
    const errors = e as Errors
    if (!errors[SPONSORSHIP_REQUIRED_ERROR]) {
      showToast(errors[Object.keys(errors)[0]], ToastType.Error)
    }
  } finally {
    hideDialog()
  }
}

const hideDialog = () => {
  hide()
  setTimeout(() => {
    resetForm()
  }, 200)
}

const resetForm = () => {
  form.name = ''
  form.body = JSON.stringify({
    groups: [cloneDeep(defaultGroup)],
  })
}
</script>
