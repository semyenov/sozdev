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
        :keeps="25"
        :page-mode="false"
        :estimate-size="70"
        :data-ids="objectsIds || objectsGetter"
        :data-getter="objectGetter"
        :data-component="ObjectsItem"
        data-key="page-objects-index-virtuallist"
        class="overflow-auto p-4"
        item-class="mb-3"
      >
        <template #header>
          <AInput v-model="input" color="primary" class="sticky mb-6" prepend-inner-icon="i-ph:magnifying-glass" :placeholder="$t('objects.search.placeholder')" />
        </template>
      </UiVirtualList>
    </WinboxWindow>
  </div>
</template>
