<script setup lang="ts">
const route = useRoute()
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, v => v && toggleDark())
// const authorizationStore = useAuthorizationStore()
// const backendStore = useBackendStore()
</script>

<template>
  <div class="h-full w-full flex flex-row">
    <div id="teleport-layer--10" class="absolute left-0 right-0 z-100 h-0 w-full" />
    <div id="teleport-layer--20" class="absolute left-0 right-0 z-200 h-0 w-full" />
    <PageSidebar class="z-300 shadow-lg shadow-warmGray/40 backdrop-blur-20 backdrop-filter" />

    <!-- <MapLibre /> -->

    <div class="w-full flex flex-col">
      <div class="z-300 h-45px flex flex-row items-center justify-between border-b border-warmGray-300 bg-warmGray-200/80 px-4 shadow-warmGray/20 shadow-xl backdrop-blur-10 backdrop-filter">
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
