<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'authorization',
  validate: r =>
    r.name === 'objects-id' ? validateUuid(r.params.id) : false,
})

const route = useRoute('objects-id')
const id = route.params.id as string

const objectsStore = useObjectsStore()
const objectGetter = objectsStore.itemGetter

const item = await objectGetter(id)
</script>

<template>
  <div class="page h-full w-full page-objects-id">
    <div v-if="item" class="flex flex-row box-color__default--2 sticky">
      <PageTitle v-if="item.info.name">
        {{ `# ${item.info.name} Page` }}
      </PageTitle>
    </div>
    <div
      v-if="item"
      class="h-full w-full flex max-h-screen flex-col items-center overflow-y-scroll p-6 scrollbar box-color__default--1 scrollbar-rounded gap-8 max-w-200"
    >
      <ObjectsItem :item="item" :index="0" />
    </div>
  </div>
</template>
