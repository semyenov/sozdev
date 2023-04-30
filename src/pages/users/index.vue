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
        class: ['wb-left', 'no-header'],
        border: 0,
        top: 0,
        left: 45,
        bottom: 0,
        // right: '50%',
        background: 'rgba(231,229,228,0.7)',
        height: '100%',
        minheight: '100%',
        width: 450,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiVirtualList
        ref="listComponent"
        key="page-users-index-virtuallist"
        :keeps="48"
        :page-mode="false"
        :estimate-size="70"
        :data-ids="usersIds"
        :data-getter="usersGetter"
        :data-component="UsersItem"
        data-key="page-users-index-virtuallist"
        wrap-class="flex flex-col w-full h-full"
        class="flex flex-grow flex-col items-center overflow-auto py-2 pl-4 pr-0"
        item-class="mb-2 rounded-r-0 text-sm"
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
