<script setup lang="ts">
import { UiVirtualList, UsersItem } from '#components'

definePageMeta({
  layout: 'default',
  middleware: 'authorization',
})

const { t } = useI18n()
const route = useRoute('users')

const usersStore = useUsersStore()
const usersIds = await usersStore.itemsGetter
const usersGetter = usersStore.itemGetter

const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)

const listScrollStep = 10
const listScrollIndex = ref(listScrollStep)

function scrollClickHandler() {
  if (!listComponent.value)
    return

  if (listScrollIndex.value > usersIds.value.length) {
    listComponent.value.scrollToBottom()
    listScrollIndex.value = 0

    return
  }

  listComponent.value.scrollToIndex(listScrollIndex.value)
  listScrollIndex.value += listScrollStep
}
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-users',
        teleportId: 'teleport-layer--10',
        title: t('users.title'),
        class: ['simple', 'wb-left', 'no-close'],
        border: 0,
        top: 0,
        left: 45,
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
        class="flex flex-grow flex-col items-center gap-8 overflow-auto p-4"
        :estimate-size="70"
        item-class="mb-6"
      />
    </WinboxWindow>

    <div class="absolute bottom-8 right-8 z-10 flex flex-col gap-4">
      <UiButton
        outline
        size="md"
        class="h-11"
        color="default"
        @click="scrollClickHandler"
      >
        <i class="i-carbon:arrow-down inline-block" />
      </UiButton>
    </div>
  </div>
</template>
