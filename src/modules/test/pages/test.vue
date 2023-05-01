<script setup lang="ts">
import { notUndefined } from '@antfu/utils'
import { defaultThemeColors } from 'anu-vue'

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
const tabs = [
  {
    title: 'Account',
    value: 'account',
    icon: 'i-bx-user',
  },
  {
    title: 'Notifications',
    value: 'notifications',
    icon: 'i-bx-bell',
  },
  {
    title: 'Settings',
    value: 'settings',
    icon: 'i-bx-cog',
  },
  {
    title: 'Test',
    value: 'test',
    icon: 'i-bx-cog',
  },
]

const items = [
  {
    text: 'test1',
    disabled: false,
  },
  {
    text: 'test2',
    disabled: false,
  },
  {
    text: 'test3',
    disabled: true,
  },
]

const isDialogShown = ref<boolean>(false)

const chips = ref(defaultThemeColors.map(c => ({
  color: c,
  isClosed: true,
})))

const allChipsClosed = computed(() => chips.value.every(chip => !chip.isClosed))
const reset = () => chips.value.forEach(chip => chip.isClosed = true)

const alertLoading = ref(false)

const cardLoading = ref(false)

const { ready: btnLoaded, start: startBtnLoading } = useTimeout(1500, { controls: true })
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-test',
        teleportId: 'teleport-layer--10',
        title: t('test.title'),
        class: ['wb-left', 'no-close', 'border-none'],
        index: 10,
        border: 0,
        top: 45,
        left: 45,
        bottom: 0,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <SimpleBar
        class="overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <div class="flex flex-col items-center p-4">
          <PageProse class="max-w-300 w-full">
            <h4 class="text-default-500 dark:text-default-400 mt-0 font-medium">
              Tooltip
            </h4>
            <div class="flex flex-wrap items-start justify-start gap-4">
              <ABtn>
                <ATooltip text="Hello!" />
                Hover Over Me
              </ABtn>
              <ABtn>
                <!-- ℹ️ You can also customize `--a-tooltip-bg-c` CSS var for changing tooltip background -->
                <ATooltip class="[&_.a-tooltip]-bg-danger">
                  <span class="a-tooltip-text">
                    <i class="i-bx-shield-x me-1" />
                    <span>Protection is disabled</span>
                  </span>
                </ATooltip>
                Scan Skipped
              </ABtn>

              <ABtn>
                <ATooltip placement="top" text="Hello!" />
                Top tooltip
              </ABtn>
            </div>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              Dialog
            </h4>
            <div class="flex flex-col flex-wrap items-start justify-start gap-4">
              <ADialog
                v-model="isDialogShown"
                title="Dialog title"
                subtitle="Chocolate cake tiramisu donut"
                text="Ice cream sweet pie pie dessert sweet danish. Jelly jelly beans cupcake jelly-o chocolate bonbon chocolate bar."
              />

              <ABtn @click="isDialogShown = true">
                Show dialog
              </ABtn>
            </div>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              Closable chip
            </h4>
            <div class="flex flex-col flex-wrap justify-center gap-4">
              <AChip
                v-for="chip in chips"
                :key="chip.color"
                v-model="chip.isClosed"
                :color="chip.color"
                closable
                class="justify-between capitalize"
              >
                {{ chip.color }}
              </AChip>

              <div class="w-full">
                <ABtn
                  v-if="allChipsClosed"
                  @click="reset"
                >
                  Return Chips
                </ABtn>
              </div>
            </div>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              Loaders
            </h4>
            <div class="flex flex-wrap items-start justify-start gap-4">
              <AAlert
                variant="fill"
                class="relative cursor-pointer"
                icon="i-bx-info-circle"
                @click="alertLoading = !alertLoading"
              >
                Click me to toggle loading
                <ALoader :loading="alertLoading" />
              </AAlert>

              <ABtn @click="startBtnLoading">
                <ALoadingIcon
                  icon="i-bx-cloud-upload"
                  :loading="!btnLoaded"
                />
                <span>Upload</span>
              </ABtn>

              <ACard
                title="Click me"
                subtitle="Chocolate cake tiramisu donut"
                text="Ice cream sweet pie pie dessert sweet danish. Jelly jelly beans cupcake jelly-o chocolate bonbon chocolate bar."
                :loading="cardLoading"
                variant="light"
                color="primary"
                @click="cardLoading = !cardLoading"
              />
            </div>

            <!-- <h4 class="text-default-500 dark:text-default-400 font-medium">
              Date Picker
            </h4>
            <div class="flex flex-col flex-wrap items-start justify-start gap-4">
              selected: {{ inputDatePicker }}
              <UiDatepicker v-model="inputDatePicker" />
            </div> -->

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              List
            </h4>
            <div class="flex flex-col flex-wrap items-start justify-start gap-4">
              <AList
                :items="items"
                class="[--a-list-item-margin:0_0] [padding:0] m-y-0 w-full p-x-0"
              >
                <AListItem
                  v-for="(item, index) in items"
                  :key="item.text"
                  :text="item.text"
                  :value="index"
                  class="primary"
                >
                  <template #append>
                    <span class="kbd">
                      &#8984; {{ item.text }}
                    </span>
                  </template>
                </AListItem>
              </AList>
            </div>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              New Tabs
            </h4>
            <ATabs
              class="tabs"
              :tabs="tabs"
              transition="view-next"
            >
              <!-- 👉 Account -->
              <template #account>
                <div class="a-card-body">
                  Bear claw sweet dessert sweet chocolate bar sesame snaps shortbread.
                </div>
              </template>

              <!-- 👉 Notifications -->
              <template #notifications>
                <div class="a-card-body">
                  Lollipop marzipan cotton candy pie macaroon wafer jelly beans shortbread.
                </div>
              </template>

              <!-- 👉 Settings -->
              <template #settings>
                <div class="a-card-body">
                  Pastry biscuit tart I love gummies wafer oat cake.
                </div>
              </template>
              <template #test>
                <div class="a-card-body">
                  Hello, Alexander! Vue.js makes the animations and transitions incredibly easy to implement. So you should really use this opportunity to give a little spark to your application/website to shine. Nuxt.js already builds on the provided capabilities of Vue.js. It gives you a possibility to create a very simple transitions between the pages very fast and almost for no effort.
                </div>
              </template>
            </ATabs>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              Tabs
            </h4>
            <div class="flex flex-col flex-wrap items-center justify-start gap-4">
              <UiTabsList v-model="inputTab" class="flex flex-row gap-1.5">
                <UiTabsListItem>
                  <template #default="{ activateTab, isActive }">
                    <ABtn :variant="isActive ? 'fill' : 'outline'" :states="!isActive" @click="activateTab">
                      Tab 1
                    </ABtn>
                  </template>
                </UiTabsListItem>
                <UiTabsListItem>
                  <template #default="{ activateTab, isActive }">
                    <ABtn :variant="isActive ? 'fill' : 'outline'" :states="!isActive" @click="activateTab">
                      Tab 2
                    </ABtn>
                  </template>
                </UiTabsListItem>
              </UiTabsList>
              <UiTabsPanels v-model="inputTab">
                <UiTabsPanelsItem>Tab Panel 1</UiTabsPanelsItem>
                <UiTabsPanelsItem>Tab Panel 2</UiTabsPanelsItem>
              </UiTabsPanels>
            </div>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
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

            <h4 class="text-default-500 dark:text-default-400 font-medium">
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

            <h4 class="text-default-500 dark:text-default-400 font-medium">
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
                <ABtn
                  v-for="color in uiColorVariants"
                  :key="`input-${color}`"
                  :color="color"
                >
                  <i class="i-carbon:download inline-block" />
                  <span>{{
                    `${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`
                  }}</span>
                </ABtn>
              </div>
              <div
                v-for="(size, index) in uiSizeVariants"
                :key="`input-size__${size} input-rounded__${rounded}`"
                class="mb-6 flex flex-row flex-wrap items-center justify-start"
                :class="`gap-${(index + 4) * 0.5}`"
              >
                <ABtn
                  v-for="color in uiColorVariants"
                  :key="`input-${color}-outline`"
                  :color="color"
                >
                  <i class="i-carbon:download inline-block" />
                  <span>{{
                    `${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`
                  }}</span>
                </ABtn>
              </div>
            </template>

            <h4 class="text-default-500 dark:text-default-400 font-medium">
              Inputs
            </h4>
            <template v-for="rounded in uiRoundedVariants">
              <div
                v-for="(size, index) in uiSizeVariants"
                :key="`btn-size__${size} btn-rounded__${rounded}`"
                class="mb-6 w-full flex flex-col flex-wrap items-center justify-start"
                :class="`gap-${(index + 4) * 0.5}`"
              >
                <AInput
                  v-for="color in uiColorVariants"
                  :key="`btn-${color}`"
                  class="w-full flex flex-col"
                  :model-value="`${color.toUpperCase()}-${size.toUpperCase()}-${rounded.toLocaleUpperCase()}`"
                />
              </div>
            </template>
          </PageProse>
        </div>
      </SimpleBar>
    </WinboxWindow>
  </div>
</template>

<style lang="postcss">
.tabs {
  .a-tab-title {
    @apply m-0
  }
}
</style>
