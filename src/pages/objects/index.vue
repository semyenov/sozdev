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
const objectsIds = await objectsStore.itemsGetter
const objectSearchGetter = objectsStore.searchGetter
const objectGetter = objectsStore.itemGetter

await objectsStore.getItems()
const objectsSearchIds = computed(() => {
  if (input.value === '')
    return objectsIds.value

  return objectSearchGetter(input.value).value!
})

const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)

const listScrollStep = 10
const listScrollIndex = ref(listScrollStep)

function scrollClickHandler() {
  if (!listComponent.value)
    return

  if (listScrollIndex.value > objectsSearchIds.value.length) {
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
        class: ['wb-left', 'no-header'],
        top: 0,
        border: 0,
        left: 45,
        bottom: 45,
        // right: '50%',
        background: 'rgba(231,229,228,0.6)',
        height: '100%',
        minheight: '100%',
        width: 550,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <AInput v-model="input" color="primary" class="border-b" append-inner-icon="i-carbon:search" input-wrapper-classes="rounded-0 border-none bg-white" :placeholder="$t('objects.search.placeholder')" />

      <UiVirtualList
        ref="listComponent"
        :keeps="25"
        :page-mode="false"
        :estimate-size="70"
        :data-ids="objectsSearchIds"
        :data-getter="objectGetter"
        :data-component="ObjectsItem"
        data-key="page-objects-index-virtuallist"
        wrap-class="flex flex-col w-full h-full"
        class="flex flex-grow flex-col items-center overflow-auto py-4 pl-0 pr-6"
        item-class="mb-2 rounded-l-0 "
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
