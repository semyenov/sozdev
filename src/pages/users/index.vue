<script setup lang="ts">
import { UiVirtualList, UsersItem } from '#components'

definePageMeta({
  layout: 'default',
  middleware: 'authorization',
})

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
        title: $t('users.title'),
        class: ['wb-left', 'no-header'],
        border: 0,
        top: 45,
        left: 45,
        bottom: 0,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiVirtualList
        ref="listComponent"
        key="page-users-index-virtuallist"
        :keeps="50"
        :page-mode="false"
        :estimate-size="70"
        :data-ids="usersIds"
        :data-getter="usersGetter"
        :data-component="UsersItem"
        data-key="page-users-index-virtuallist"
        class="overflow-auto p-4"
        item-class="mb-3"
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
