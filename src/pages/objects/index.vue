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
        class: ['wb-left', 'no-close'],
        top: 0,
        border: 0,
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
      <AInput v-model="input" class="border-b py-0" append-inner-icon="i-carbon:search" input-wrapper-classes="rounded-0 border-none" :placeholder="$t('objects.search.placeholder')" />

      <UiVirtualList
        ref="listComponent"
        :keeps="50"
        :page-mode="false"
        :data-ids="objectsSearchIds"
        :data-getter="objectGetter"
        :data-component="ObjectsItem"
        data-key="page-objects-index-virtuallist"
        wrap-class="flex flex-col flex-grow"
        class="flex flex-grow flex-col items-center px-4 pt-4"
        item-class="mb-4"
        :estimate-size="70"
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
