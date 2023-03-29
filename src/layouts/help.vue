<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, (v) => v && toggleDark())
const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div
    class="flex flex-grow box-color__default--3 layout layout-default overflow-hidden"
  >
    <div class="z-100 h-2 layout-default__loading">
      <NuxtLoadingIndicator />
    </div>

    <div
      id="teleport-layer--20"
      class="fixed left-0 right-0 z-20 w-full flex relative layout-default__teleport h-full"
    ></div>

    <div
      id="teleport-layer--10"
      class="layout-default__teleport fixed relative left-0 right-0 z-10 h-full w-full flex"
    ></div>

    <div
      v-if="authorizationStore.current"
      class="z-10 flex flex-col layout-default__current-user"
    >
      <AuthorizationCurrent />
    </div>
    <div
      class="fixed bottom-0 left-0 flex flex-row layout-default__left top-0 z-3"
    >
      <div class="border-r box-color__default--2">
        <PageSidebar />
      </div>
      <div
        class="flex flex-col items-start justify-items-stretch text-left layout-default__page z-0"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
