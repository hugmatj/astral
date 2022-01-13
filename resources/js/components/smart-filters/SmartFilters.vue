<template>
  <div>
    <div v-for="(group, i) in filterBody.groups" :key="`group-${i}`" class="py-8 border-b border-gray-200 group">
      <div class="flex items-center">
        <BaseSelect v-model="group.logicalType" class="w-auto">
          <option value="any">Any</option>
          <option value="all">All</option>
          <option value="none">None</option>
        </BaseSelect>
        <BaseButton
          v-if="filterBody.groups.length > 1"
          class="ml-auto space-x-1 transition-opacity opacity-0 btn btn-grey hover:bg-red-50 group-hover:opacity-100"
          kind="danger-borderless"
          size="sm"
          @click="removeGroup(i)"
        >
          <MinusCircleIcon class="w-4 h-4" aria-hidden="true" />
          <span>Remove Group</span></BaseButton
        >
      </div>
      <div
        v-for="(predicate, j) in group.predicates"
        :key="`group-${i}-predicate-${j}`"
        class="flex items-center w-full mt-4"
      >
        <div class="flex items-center w-full space-x-2">
          <BaseSelect v-model="predicate.selectedTarget" @change="setDefaultArgumentValue(predicate)">
            <option
              v-for="(target, k) in predicateTargets"
              :key="`group-${i}-predicate-${j}-target-${k}`"
              :value="target.key"
            >
              {{ target.label }}
            </option>
          </BaseSelect>
          <BaseSelect
            :model-value="currentOperator(predicate)"
            class="ml-4"
            @change="setPredicateOperator($event, predicate)"
          >
            <option
              v-for="operator in selectedPredicateTarget(predicate)?.operators"
              :key="operator.key"
              :value="operator.key"
            >
              {{ operator.label }}
            </option>
          </BaseSelect>
          <component
            :is="predicateTargetFilters[selectedPredicateTarget(predicate)?.type || 'String']"
            v-if="selectedPredicateTarget(predicate)?.type"
            v-model="predicate.argument"
          />
        </div>
        <div class="flex-shrink-0 pl-2 ml-auto space-x-2">
          <button
            type="button"
            class="inline-flex items-center justify-center w-8 h-8 text-lg font-semibold text-gray-400 transition-colors bg-gray-100 border-2 border-gray-400 rounded-full shadow-md hover:text-gray-500 hover:border-gray-500 active:bg-gray-200"
            aria-label="Add Row"
            @click="appendRow(i)"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
          <button
            v-if="group.predicates.length > 1"
            type="button"
            class="inline-flex items-center justify-center w-8 h-8 text-lg font-semibold text-gray-400 transition-colors bg-gray-100 border-2 border-gray-400 rounded-full shadow-md hover:text-gray-500 hover:border-gray-500 active:bg-gray-200"
            aria-label="Remove Row"
            @click="removeRow(i, j)"
          >
            <MinusIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <BaseButton class="space-x-1 btn btn-grey hover:bg-brand-50" kind="primary-borderless" @click="appendGroup">
        <PlusIcon class="w-5 h-5" aria-hidden="true" />
        <span>Add Group</span>
      </BaseButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, defineComponent } from 'vue'
import BaseSelect from '@/components/shared/core/BaseSelect.vue'
import BaseButton from '@/components/shared/core/BaseButton.vue'
import StringFilter from '@/components/smart-filters/filters/StringFilter.vue'
import NumberFilter from '@/components/smart-filters/filters/NumberFilter.vue'
import StateFilter from '@/components/smart-filters/filters/StateFilter.vue'
import TagsFilter from '@/components/smart-filters/filters/TagsFilter.vue'
import LanguageFilter from '@/components/smart-filters/filters/LanguageFilter.vue'
import DateFilter from '@/components/smart-filters/filters/DateFilter.vue'
import cloneDeep from 'lodash/cloneDeep'
import { PlusIcon, MinusIcon, MinusCircleIcon } from '@heroicons/vue/solid'
import {
  predicateTargets,
  PredicateGroup,
  Predicate,
  defaultPredicate,
  defaultGroup,
  PredicateTargetType,
} from '@/utils/predicates'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const predicateTargetFilters: Record<PredicateTargetType, ReturnType<typeof defineComponent>> = {
  String: StringFilter,
  Number: NumberFilter,
  State: StateFilter,
  Tags: TagsFilter,
  Language: LanguageFilter,
  Date: DateFilter,
}

const filterBody = reactive<Record<'groups', PredicateGroup[]>>({
  groups: [],
})

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(filterBody, JSON.parse(value) as PredicateGroup[])
  },
  { immediate: true }
)

watch(
  filterBody,
  (filter) => {
    emit('update:modelValue', JSON.stringify(filter))
  },
  { deep: true }
)

const setPredicateOperator = (e: Event, predicate: Predicate) => {
  predicate.operator = (e.target as HTMLSelectElement).value
}

const selectedPredicateTarget = (predicate: Predicate) => {
  return predicateTargets.find((target) => target.key === predicate.selectedTarget)
}

const setDefaultArgumentValue = (predicate: Predicate) => {
  if (selectedPredicateTarget(predicate)?.defaultValue !== undefined) {
    if (typeof selectedPredicateTarget(predicate)?.defaultValue === 'function') {
      predicate.argument = selectedPredicateTarget(predicate)?.defaultValue()
    } else {
      predicate.argument = selectedPredicateTarget(predicate)?.defaultValue
    }
  }
}

const currentOperator = (predicate: Predicate) => {
  if (
    selectedPredicateTarget(predicate) &&
    selectedPredicateTarget(predicate)
      ?.operators.map((o) => o.key)
      .includes(predicate.operator)
  ) {
    return predicate.operator
  } else {
    const operator = selectedPredicateTarget(predicate)?.operators[0].key

    if (operator) {
      predicate.operator = operator
    }

    return operator
  }
}

const appendRow = (i: number) => {
  filterBody.groups[i].predicates.push(cloneDeep(defaultPredicate))
}

const removeRow = (groupIndex: number, predicateIndex: number) => {
  filterBody.groups[groupIndex].predicates.splice(predicateIndex, 1)
}

const appendGroup = () => {
  filterBody.groups.push(defaultGroup)
}

const removeGroup = (index: number) => {
  filterBody.groups.splice(index, 1)
}
</script>
