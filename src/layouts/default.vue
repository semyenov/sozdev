<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, v => v && toggleDark())
// const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div class="flex flex-grow box-color__default--3">
    <NuxtLoadingIndicator class="absolute z-100 h-4 w-full" />

    <MapLibre />
    <div
      class="flex flex-grow flex-col items-start justify-items-stretch text-left"
    >
      <div class="flex flex-grow flex-row">
        <PageSidebar class="z-30" />
        <div class="flex flex-grow flex-col">
          <NuxtPage />
        </div>
        <div class="fixed relative left-0 right-0 h-0 w-full flex flex-col">
          <div id="teleport-layer--10" class="z-10" />
          <div id="teleport-layer--20" class="z-20" />
        </div>

        <div class="flex flex-grow flex-col">
          <WinboxRoot />
        </div>
      </div>
    </div>
  </div>
</template>
