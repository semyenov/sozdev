<script setup lang="ts">
import { create, insertMultiple, search } from '@orama/orama'

import { IMetaScope } from '~/types'

import type { Document } from '@orama/orama'

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
  <div class="h-full w-full flex flex-grow">
    <NuxtLoadingIndicator class="absolute z-100 h-4 w-full" />
    <MapLibre />
    <div class="h-full w-full flex flex-row">
      <PageSidebar class="z-30" />
      <NuxtPage />
      <div class="absolute relative left-0 right-0 h-0 w-full flex flex-col">
        <div id="teleport-layer--10" class="z-10" />
        <div id="teleport-layer--20" class="z-20" />
      </div>

      <div class="flex flex-grow flex-col">
        <WinboxRoot />
      </div>
    </div>
  </div>
</template>
