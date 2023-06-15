<script setup lang="ts">
import { UiVirtualList, UsersItem } from '#components'

import type { IUser } from '~/types'

definePageMeta({
  layout: 'default',
})

const route = useRoute('users')
const usersStore = useUsersStore()

const { t } = useI18n()

const input = ref<string>('')

// export type ComponentExposed<T> =
// T extends new () => infer E ? E :
//  T extends (props: any, ctx: { expose(exposed: infer E): any }, ...args: any) => any ? NonNullable<E> :
//   {}

const usersGetter = await usersStore.itemsGetter
const userSearchGetter = usersStore.searchGetter
const usersIds = asyncComputed(() => userSearchGetter(input.value))
const userGetter = usersStore.itemGetter

const listComponent = ref<ReturnType<typeof UiVirtualList<IUser>> | null>(null)

const listScrollStep = 10
const listScrollIndex = ref(listScrollStep)

function scrollClickHandler() {
  if (!listComponent.value)
    return

  if (listScrollIndex.value > usersIds.value.length) {
    // @ts-expect-error FIXME: Generic Components
    listComponent.value.scrollToBottom()
    listScrollIndex.value = 0

    return
  }

  // @ts-expect-error FIXME: Generic Components
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
        class: ['no-header'],
        border: 0,
        top: 44,
        left: 44,
        bottom: -1,
        right: -1,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiVirtualList
        ref="listComponent"
        key="page-users-index-virtuallist"
        :keeps="25"
        :estimate-size="70"
        :data-ids="usersIds || usersGetter"
        :data-getter="userGetter"
        :data-component="UsersItem"
        data-key="page-users-index-virtuallist"
        class="overflow-auto p-4"
        item-class="mb-3"
      >
        <template #header>
          <AInput v-model="input" color="primary" class="sticky mb-6" prepend-inner-icon="i-ph:magnifying-glass" :placeholder="t('users.search.placeholder')" />
        </template>
      </UiVirtualList>
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
