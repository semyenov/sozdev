<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, v => v && toggleDark())
const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div
    class="box-color__default--3 layout layout-default flex flex-grow overflow-hidden"
  >
    <div class="layout-default__loading z-100 h-2">
      <NuxtLoadingIndicator />
    </div>

    <div
      id="teleport-layer--20"
      class="layout-default__teleport fixed relative left-0 right-0 z-20 h-full w-full flex"
    />

    <div
      id="teleport-layer--10"
      class="layout-default__teleport fixed relative left-0 right-0 z-10 h-full w-full flex"
    />

    <div
      v-if="authorizationStore.current"
      class="layout-default__current-user z-10 flex flex-col"
    >
      <AuthorizationCurrent />
    </div>
    <div
      class="layout-default__left fixed bottom-0 left-0 top-0 z-3 flex flex-row"
    >
      <div class="box-color__default--2 border-r">
        <PageSidebar />
      </div>
      <div
        class="layout-default__page z-0 flex flex-col items-start justify-items-stretch text-left"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
