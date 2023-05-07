<script setup lang="ts">
import { ObjectsItem, UiVirtualList } from '#components'

definePageMeta({
  layout: 'default',
  middleware: 'authorization',
})

const route = useRoute('objects')

const input = ref<string>('')

const objectsStore = useObjectsStore()
const objectsGetter = await objectsStore.itemsGetter

const objectSearchGetter = objectsStore.searchGetter
const objectGetter = objectsStore.itemGetter

const objectsIds = asyncComputed(() => objectSearchGetter(input.value))
const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-objects',
        teleportId: 'teleport-layer--10',
        title: $t('objects.title'),
        class: ['wb-left', 'no-header'],
        top: 45,
        border: 0,
        left: 45,
        bottom: 0,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiVirtualList
        ref="listComponent"
        :keeps="25"
        :page-mode="false"
        :estimate-size="70"
        :data-ids="objectsIds || objectsGetter"
        :data-getter="objectGetter"
        :data-component="ObjectsItem"
        data-key="page-objects-index-virtuallist"
        wrap-class="flex flex-col w-full h-full"
        class="flex flex-grow flex-col items-center overflow-auto px-4 py-4"
        item-class="mb-3"
      >
        <template #header>
          <AInput v-model="input" color="primary" class="sticky mb-6 shadow spacing-95" append-inner-icon="i-carbon:search" input-wrapper-classes="rounded-0 border-none  bg-white" :placeholder="$t('objects.search.placeholder')" />
        </template>
      </UiVirtualList>
    </WinboxWindow>
  </div>
</template>
