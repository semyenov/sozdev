<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, (v) => v && toggleDark())
// const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div class="flex flex-grow box-color__default--3">
    <NuxtLoadingIndicator class="w-full absolute z-100 h-2" />

    <div class="flex-col flex w-full fixed right-0 relative left-0 h-0">
      <div id="teleport-layer--10" class="z-10" />
      <div id="teleport-layer--20" class="z-20" />
    </div>

    <!-- <div class="flex flex-col"> -->
    <WinboxRoot />
    <!-- </div> -->

    <MapLibre />

    <div
      class="flex flex-grow flex-col text-left items-start justify-items-stretch"
    >
      <div class="flex flex-grow flex-row">
        <PageSidebar class="z-30" />
        <div class="flex flex-col flex-grow">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
