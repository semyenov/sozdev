<script setup lang="ts">
import { ObjectsItem, UiVirtualList } from '#components'

definePageMeta({
  layout: 'default',
  middleware: 'authorization',
})

const { t } = useI18n()
const route = useRoute('objects')

const input = ref<string>('')

const objectsStore = useObjectsStore()
// const objectsIds = await objectsStore.itemsGetter
const objectSearchGetter = objectsStore.searchGetter
const objectGetter = objectsStore.itemGetter

await objectsStore.getItems()
const objectsIds = computed(() => {
  if (input.value === '')
    return []

  return objectSearchGetter(input.value).value!
})

const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)

const listScrollStep = 10
const listScrollIndex = ref(listScrollStep)

function scrollClickHandler() {
  if (!listComponent.value)
    return

  if (listScrollIndex.value > objectsIds.value.length) {
    listComponent.value.scrollToBottom()
    listScrollIndex.value = 0

    return
  }

  listComponent.value.scrollToIndex(listScrollIndex.value)
  listScrollIndex.value += listScrollStep
}

async function loadOthersHandler() {
  await objectsStore.getOthers()
}
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-objects',
        teleportId: 'teleport-layer--10',
        title: t('objects.title'),
        class: ['simple', 'wb-left', 'no-close'],
        top: 0,
        border: 0,
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
      <div class="w-full flex flex-row items-center justify-center border-b border-b-dashed px-6 py-4 box-color__default--1">
        <UiInput
          key="page-objects-index-virtuallist-search"
          v-model="input"
          class="w-full"
          placeholder="Search"
          size="md"
          color="default"
          outline
        />
      </div>
      <UiVirtualList
        ref="listComponent"
        :keeps="50"
        :page-mode="false"
        :data-ids="objectsIds"
        :data-getter="objectGetter"
        :data-component="ObjectsItem"
        data-key="page-objects-index-virtuallist"
        wrap-class="flex flex-col w-full"
        class="flex flex-grow flex-col items-center gap-8 overflow-auto p-6"
        :estimate-size="70"
        item-class="mb-6"
      />
    </WinboxWindow>

    <div class="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
      <UiButton
        class="h-11"
        color="default"
        outline
        size="md"
        @click.prevent="loadOthersHandler"
      >
        <i class="i-carbon:download inline-block" />
      </UiButton>
      <UiButton
        class="h-11"
        color="default"
        outline
        size="md"
        @click.prevent="scrollClickHandler"
      >
        <i class="i-carbon:arrow-down inline-block" />
      </UiButton>
    </div>
  </div>
</template>
