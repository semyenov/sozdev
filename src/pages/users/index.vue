<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { UiVirtualList, UsersItem } from '#components'

definePageMeta({
  layout: 'default',
  middleware: 'authorization',
})

const { t } = useI18n()

const usersStore = useUsersStore()
const usersIds = await usersStore.itemsGetter
const usersGetter = usersStore.itemGetter

const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)

// const listScrollStep = 10
// const listScrollIndex = ref(listScrollStep)

// function scrollClickHandler() {
//   if (!listComponent.value) {
//     return
//   }

//   if (listScrollIndex.value > usersIds.value.length) {
//     listComponent.value.scrollToBottom()
//     listScrollIndex.value = 0

//     return
//   }

//   listComponent.value.scrollToIndex(listScrollIndex.value)
//   listScrollIndex.value += listScrollStep
// }
</script>

<template>
  <WinboxWindow
    :params="{
      id: 'page-users',
      teleportId: 'teleport-layer--10',
      title: t('users.title'),
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
    <UiVirtualList
      ref="listComponent"
      key="page-users-index-virtuallist"
      :keeps="50"
      :page-mode="false"
      :data-ids="usersIds"
      :data-getter="usersGetter"
      :data-component="UsersItem"
      data-key="page-users-index-virtuallist"
      wrap-class="flex flex-col w-full"
      class="page flex flex-col overflow-y-scroll p-6 scrollbar scrollbar-rounded h-auto max-h-full flex-grow items-center gap-8 page-users-index"
      :estimate-size="70"
      item-class="mb-6"
    >
      <!-- <template #header>
        <div class="absolute flex flex-col gap-4 right-8 bottom-20 z-10">
          <Button
            outline
            size="md"
            class="h-11"
            rounded="full"
            color="default"
            @click="scrollClickHandler"
          >
            <i class="i-carbon:arrow-down inline-block" />
          </Button>
        </div>
      </template> -->
    </UiVirtualList>
  </WinboxWindow>
</template>
