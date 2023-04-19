<script setup lang="ts">
import { notUndefined } from '@antfu/utils'

import { UsersComboboxItem } from '#components'

import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

const { t, d } = useI18n()
const route = useRoute('test')

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
      async item => (await usersStore.itemGetter(item)).value,
    ),
  )
).filter(notUndefined)

const input = ref<string | undefined>(undefined)
const inputTab = ref<number>(0)

const inputDatePicker = ref<Date | string>(
  d(new Date().toISOString(), 'medium'),
)
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-test',
        teleportId: 'teleport-layer--10',
        title: t('test.title'),
        class: ['simple', 'wb-left', 'no-close'],
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
      <div class="grid-row grid-cols-2 sm:grid-cols-4">
        <!-- 👉 Sales -->
        <div class="flex items-center gap-x-3">
          <AAvatar
            icon="i-bx-trending-up"
            color="success"
            class="rounded-lg text-[1.25rem]"
          />
          <ATypography
            :title="['Sales', 'text-sm font-normal !text-medium-emphasis']"
            :subtitle="['2.5k', 'text-xl font-bold !text-high-emphasis']"
          />
        </div>

        <!-- 👉 Revenue -->
        <div class="flex items-center gap-x-3">
          <AAvatar
            icon="i-bx-dollar"
            class="rounded-lg text-[1.25rem]"
          />
          <ATypography
            :title="['Revenue', 'text-sm !text-medium-emphasis font-normal']"
            :subtitle="['$816', 'text-xl font-bold !text-high-emphasis']"
          />
        </div>

        <!-- 👉 Customer -->
        <div class="flex items-center gap-x-3">
          <AAvatar
            icon="i-bx-face"
            color="info"
            class="rounded-lg text-[1.25rem]"
          />
          <ATypography
            :title="['Customers', 'text-sm !text-medium-emphasis font-normal']"
            :subtitle="['1.5', 'text-xl font-bold !text-high-emphasis']"
          />
        </div>

        <!-- 👉 Returns -->
        <div class="flex items-center gap-x-3">
          <AAvatar
            icon="i-bx-navigation"
            color="danger"
            class="rounded-lg text-[1.25rem]"
          />
          <ATypography
            :title="['Returns', 'text-sm !text-medium-emphasis font-normal']"
            :subtitle="['1.5', 'text-xl font-bold !text-high-emphasis']"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-8">
        <!-- Icon -->
        <ABadge :content="9">
          <i class="i-bx-bell h-6 w-6" />
        </ABadge>

        <!-- Button -->
        <ABadge :content="9">
          <ABtn>
            Button
          </ABtn>
        </ABadge>

        <!-- Avatar -->
        <ABadge
          :content="9"
          offset-x="16"
          offset-y="16"
        >
          <AAvatar src="/images/demo/portrait-1.jpg" />
        </ABadge>
      </div>
      <div class="flex flex-col items-center p-6">
        <PageProse class="max-w-300">
          <h4 class="mt-0 font-medium text-default-500 dark:text-default-400">
            Tooltip
          </h4>
          <div class="flex flex-col flex-wrap items-start justify-start gap-4">
            <UiToast />
          </div>
          <h4 class="font-medium text-default-500 dark:text-default-400">
            Date Picker
          </h4>
          <div class="flex flex-col flex-wrap items-start justify-start gap-4">
            selected: {{ inputDatePicker }}
            <UiDatepicker v-model="inputDatePicker" />
          </div>
          <h4 class="font-medium text-default-500 dark:text-default-400">
            List
          </h4>
          <div class="flex flex-col flex-wrap items-center justify-start gap-4">
            <UiList
              v-slot="{ item }"
              :items="['test1', 'test2', 'test3']"
              color="primary"
            >
              <div class="test">
                {{ item }}
              </div>
            </UiList>
          </div>

          <h4 class="font-medium text-default-500 dark:text-default-400">
            Tabs
          </h4>
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
              <div class="-mt-6">
                {{ color }}
              </div>
              <div class="text-4xl font-bold">
                {{ variant }}
              </div>
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
    </WinboxWindow>
  </div>
</template>
