<template>
  <Popover v-slot="{ open }" class="relative">
    <WatchValue :value="open" @change="setDatePickerVisibility($event)" />
    <div class="relative">
      <BaseTextInput
        ref="inputRef"
        :model-value="dateFns.format(selectedDate, 'yyyy-MM-dd')"
        :class="{ 'flex-grow': true, 'ring-gray-400 dark:ring-gray-600 border-gray-400': open && isDatePickerShowing }"
        readonly
      />
      <PopoverButton
        v-show="!isDatePickerShowing && !open"
        class="absolute inset-0 z-10 cursor-text"
        aria-label="Show Datepicker"
      ></PopoverButton>
    </div>
    <Portal as="template">
      <div v-show="isDatePickerShowing && open">
        <PopoverPanel
          static
          class="absolute z-10 w-64 p-2 -mt-2 text-xs -translate-y-full bg-white border rounded shadow-sm datepicker"
          :style="{
            left: inputRect.left + 'px',
            top: inputRect.top + 'px',
          }"
        >
          <div class="relative grid h-full grid-cols-7 overflow-hidden">
            <header
              class="flex items-center justify-between col-span-7 px-3 pt-2 pb-4 font-semibold text-center text-gray-700"
            >
              <button aria-label="Previous Month" type="button" @click="previousMonth()">
                <ArrowSmLeftIcon class="w-4 h-4" />
              </button>
              <span>{{ currentMonthLabel }} {{ currentYear }}</span>
              <button aria-label="Next Month" type="button" @click="nextMonth()">
                <ArrowSmRightIcon class="w-4 h-4" />
              </button>
            </header>
            <div v-for="dayLabel in DAY_LABELS" :key="dayLabel" class="font-semibold text-center headings">
              {{ dayLabel }}
            </div>
            <PopoverButton
              v-for="(day, index) in dates"
              :key="index"
              class="w-full text-center border border-transparent rounded aspect-square hover:border-gray-300"
              :class="{
                'bg-gray-100': day.isToday,
                'text-gray-700': day.isCurrentMonth,
                'text-gray-300': !day.isCurrentMonth,
                'bg-brand-100 text-brand-700 font-bold hover:border-brand-400': day.isSelected,
              }"
              type="button"
              @click="setSelectedDate(day)"
            >
              {{ formatDateToDay(day.date) }}
            </PopoverButton>
          </div>
        </PopoverPanel>
      </div>
    </Portal>
  </Popover>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import BaseTextInput from '@/components/shared/core/BaseTextInput.vue'
import WatchValue from '@/components/shared/core/WatchValue.vue'
import { Popover, PopoverButton, PopoverPanel, Portal } from '@headlessui/vue'
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/vue/solid'
import * as dateFns from 'date-fns'

interface Props {
  modelValue?: string
}

interface DateWithMeta {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// https://codepen.io/sdbrannum/pen/QYqKzw
const DAY_LABELS = ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const isDatePickerShowing = ref(false)
const inputRef = ref<typeof BaseTextInput | null>(null)
let inputRect = reactive<Pick<Record<keyof DOMRect, number>, 'top' | 'left' | 'height'>>({
  top: 0,
  left: 0,
  height: 38,
})

const selectedDate = ref(props.modelValue ? dateFns.parse(props.modelValue, 'yyyy-MM-dd', new Date()) : new Date())
const today = ref(new Date())
const dateCursor = ref(today.value)

const currentMonth = computed(() => dateCursor.value.getMonth())
const currentMonthLabel = computed(() => MONTH_LABELS[currentMonth.value])
const currentYear = computed(() => dateCursor.value.getFullYear())

const dates = computed(() => {
  const cursor = dateCursor.value
  let startDate = dateFns.startOfMonth(cursor)
  let endDate = dateFns.endOfMonth(cursor)
  let leadPaddingDays = dateFns.getDay(startDate)
  let trailingPaddingDays = 6 - dateFns.getDay(endDate)

  startDate = dateFns.addDays(startDate, -leadPaddingDays)
  endDate = dateFns.addDays(endDate, trailingPaddingDays)

  return dateFns.eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) =>
      ({
        date,
        isCurrentMonth: dateFns.isSameMonth(cursor, date),
        isToday: dateFns.isSameDay(date, today.value),
        isSelected: dateFns.isSameDay(date, selectedDate.value),
      } as DateWithMeta)
  )
})

const formatDateToDay = (date: Date) => dateFns.format(date, 'd')

const setSelectedDate = (day: DateWithMeta) => {
  selectedDate.value = day.date
  emit('update:modelValue', dateFns.format(selectedDate.value, 'yyyy-MM-dd'))

  if (!day.isCurrentMonth) {
    dateCursor.value = dateFns.setMonth(dateCursor.value, dateFns.getMonth(selectedDate.value))
  }

  isDatePickerShowing.value = false
}

const nextMonth = () => {
  dateCursor.value = dateFns.addMonths(dateCursor.value, 1)
}

const previousMonth = () => {
  dateCursor.value = dateFns.subMonths(dateCursor.value, 1)
}

const showDatepicker = async () => {
  inputRect.top = inputRef.value?.$el.getBoundingClientRect().top || 0
  inputRect.left = inputRef.value?.$el.getBoundingClientRect().left || 0

  await nextTick()

  isDatePickerShowing.value = true
}

const hideDatepicker = async () => {
  isDatePickerShowing.value = false

  await nextTick()

  inputRef.value?.$el.focus()
}

const setDatePickerVisibility = (isVisible: boolean) => {
  if (isVisible) {
    showDatepicker()
  } else {
    hideDatepicker()
  }
}
</script>
