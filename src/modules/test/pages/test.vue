<script setup lang="ts">
import { notUndefined } from '@antfu/utils'
import { UiButton, UiList, UsersComboboxItem } from '#components'
import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

const { t, d } = useI18n()

const uiSizeVariants: UISizeVariants[] = ['xs', 'sm', 'md', 'lg', 'xl']

const uiColorVariants: UIColorVariants[] = [
  'default',
  'primary',
  'secondary',
  'third',
  'fourth',
]

const uiRoundedVariants: UIRoundedVariants[] = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'full',
]

const usersStore = useUsersStore()
const usersOptionsIds = await usersStore.itemsGetter

const usersOptions = (
  await Promise.all(
    usersOptionsIds.value.map(
      async (item) => (await usersStore.itemGetter(item)).value
    )
  )
).filter(notUndefined)

const input = ref<string | undefined>(undefined)
const inputTab = ref<number>(0)
console.log(d(new Date().toISOString(), 'medium'))
console.log(d(new Date().toISOString()))

const inputDatePicker = ref<Date | string>(
  d(new Date().toISOString(), 'medium')
)
</script>

<template>
  <UiWinbox
    show
    teleport-id="teleport-layer--10"
    :params="{
      title: t('test.title'),
      class: ['simple', 'wb-left', 'no-move', 'no-close', 'border-l-none'],
      index: 10,
      border: 0,
      top: 0,
      left: 44,
      bottom: 0,
      right: '50%',
      height: '100%',
      minheight: '100%',
      width: 550,
      minwidth: 500,
      tether: ['left', 'top', 'bottom'],
    }"
  >
    <div class="flex flex-col items-center p-6">
      <PageProse class="max-w-300">
        <h4 class="mt-0 font-medium text-default-500 dark:text-default-400">
          Date Picker
        </h4>
        <div class="flex flex-col flex-wrap items-start justify-start gap-4">
          selected: {{ inputDatePicker }}
          <UiDatepicker v-model="inputDatePicker" />
        </div>
        <h4 class="font-medium text-default-500 dark:text-default-400">List</h4>
        <div class="flex flex-col flex-wrap items-center justify-start gap-4">
          <UiList
            v-slot="{ item }"
            :items="['test1', 'test2', 'test3']"
            color="primary"
          >
            <div class="test">{{ item }}</div>
          </UiList>
        </div>

        <h4 class="font-medium text-default-500 dark:text-default-400">Tabs</h4>
        <div class="flex flex-col flex-wrap items-center justify-start gap-4">
          <UiTabsList v-model="inputTab" class="flex flex-row gap-1.5">
            <UiTabsListItem>
              <template #default="{ activateTab, isActive }">
                <UiButton :outline="!isActive" @click="activateTab">
                  Tab 1
                </UiButton>
              </template>
            </UiTabsListItem>
            <UiTabsListItem>
              <template #default="{ activateTab, isActive }">
                <UiButton :outline="!isActive" @click="activateTab">
                  Tab 2
                </UiButton>
              </template>
            </UiTabsListItem>
          </UiTabsList>
          <UiTabsPanels v-model="inputTab">
            <UiTabsPanelsItem>Tab Panel 1</UiTabsPanelsItem>
            <UiTabsPanelsItem>Tab Panel 2</UiTabsPanelsItem>
          </UiTabsPanels>
        </div>

        <h4 class="font-medium text-default-500 dark:text-default-400">
          Combobox
        </h4>
        <div class="flex flex-row flex-wrap items-center justify-start gap-4">
          <UiCombobox
            v-for="color in uiColorVariants"
            :key="`combobox-${color}`"
            v-model="input"
            :color="color"
            :options="usersOptions"
            :data-component="UsersComboboxItem"
            class="w-full"
          />
        </div>

        <h4 class="font-medium text-default-500 dark:text-default-400">
          Boxes
        </h4>
        <div
          v-for="color in uiColorVariants"
          :key="`box-${color}`"
          class="mb-6 flex flex-row flex-wrap items-center justify-start gap-4"
        >
          <div
            v-for="variant in 9"
            :key="`box-${variant}`"
            class="h-26 w-26 flex flex-col items-center justify-center break-words border p-2"
            :class="`box-color__${color}--${variant}`"
          >
            <div class="-mt-6">{{ color }}</div>
            <div class="text-4xl font-bold">{{ variant }}</div>
          </div>
        </div>

        <h4 class="font-medium text-default-500 dark:text-default-400">
          Buttons
        </h4>
        <template
          v-for="rounded in uiRoundedVariants"
          :key="`rounded-${rounded}`"
        >
          <div
            v-for="(size, index) in uiSizeVariants"
            :key="`input-size__${size} input-rounded__${rounded}`"
            class="mb-6 flex flex-row flex-wrap items-center justify-start"
            :class="`gap-${(index + 4) * 0.5}`"
          >
            <UiButton
              v-for="color in uiColorVariants"
              :key="`input-${color}`"
              :size="size"
              :color="color"
              :rounded="rounded"
            >
              <i class="i-carbon:download inline-block" />
              <span>{{
                `${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`
              }}</span>
            </UiButton>
          </div>
          <div
            v-for="(size, index) in uiSizeVariants"
            :key="`input-size__${size} input-rounded__${rounded}`"
            class="mb-6 flex flex-row flex-wrap items-center justify-start"
            :class="`gap-${(index + 4) * 0.5}`"
          >
            <UiButton
              v-for="color in uiColorVariants"
              :key="`input-${color}-outline`"
              outline
              :size="size"
              :color="color"
              :rounded="rounded"
            >
              <i class="i-carbon:download inline-block" />
              <span>{{
                `${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`
              }}</span>
            </UiButton>
          </div>
        </template>

        <h4 class="font-medium text-default-500 dark:text-default-400">
          Inputs
        </h4>
        <template v-for="rounded in uiRoundedVariants">
          <div
            v-for="(size, index) in uiSizeVariants"
            :key="`btn-size__${size} btn-rounded__${rounded}`"
            class="mb-6 w-full flex flex-col flex-wrap items-center justify-start"
            :class="`gap-${(index + 4) * 0.5}`"
          >
            <UiInput
              v-for="color in uiColorVariants"
              :key="`btn-${color}`"
              class="w-full flex flex-col"
              :size="size"
              :color="color"
              :rounded="rounded"
              :model-value="`${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`"
            />
          </div>
        </template>
      </PageProse>
    </div>
  </UiWinbox>
</template>
