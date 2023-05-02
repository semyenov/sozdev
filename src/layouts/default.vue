<script setup lang="ts">
import { create, insertMultiple, search } from '@orama/orama'

import { IMetaScope } from '~/types'

import type { Document } from '@orama/orama'

const route = useRoute()
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, v => v && toggleDark())
// const authorizationStore = useAuthorizationStore()
const backendStore = useBackendStore()

onMounted(async () => {
  window.Orama = await create({
    schema: {
      email: 'string',
      info: {
        first_name: 'string',
        last_name: 'string',
      },
    },
    components: {
      afterInsert(value) {
        value = unref(value)
      },
    },
  })

  await insertMultiple(window.Orama, (await backendStore.itemsGetter(IMetaScope.OBJECTS)).value as Document[])

  console.log(await search(window.Orama, {
    term: ' ',
    properties: '*',
  }))
})
</script>

<template>
  <div class="h-full w-full flex flex-row">
    <div id="teleport-layer--10" class="absolute left-0 right-0 z-10 h-0 w-full" />
    <PageSidebar class="z-20 shadow-lg shadow-warmGray/40 backdrop-blur-20 backdrop-filter" />
    <div id="teleport-layer--30" class="absolute left-0 right-0 z-30 h-0 w-full" />

    <MapLibre />

    <div class="w-full flex flex-col">
      <div class="h-45px flex flex-row items-center justify-between border-b border-warmGray-300 bg-warmGray-100 px-4 shadow-warmGray/20 shadow-xl backdrop-blur-10 backdrop-filter">
        <NuxtLoadingIndicator class="absolute z-100 w-full" />
        <span class="text-xl font-extrabold">
          {{ $t(`${route.name}.title`) }}
        </span>
      </div>
      <div class="nuxt-page flex flex-grow">
        <NuxtPage />
      </div>
      <WinboxRoot />
    </div>
  </div>
</template>
