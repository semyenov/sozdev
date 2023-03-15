<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, (v) => v && toggleDark())
const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div
    class="flex flex-grow layout layout-default relative overflow-hidden box-color__default--3"
  >
    <div class="layout-default__loading z-100 h-2 absolute w-full">
      <NuxtLoadingIndicator />
    </div>

    <div
      v-if="authorizationStore.current"
      class="flex flex-col layout-default__current-user z-10"
    >
      <AuthorizationCurrent />
    </div>
    <div class="fixed bottom-0 flex flex-row layout-default__left left-0 top-0">
      <div class="layout-default__sidebar z-30 border-r box-color__default--2">
        <PageSidebar />
      </div>
      <div
        class="flex flex-col text-left layout-default__page z-z-30 items-start justify-items-stretch"
      >
        <slot />
      </div>
      <div
        id="teleport-layer--20"
        class="fixed left-0 right-0 flex layout-default__teleport z-20"
      ></div>

      <div
        id="teleport-layer--10"
        class="layout-default__teleport fixed left-0 right-0 z-10 flex"
      ></div>

<!-- <div
  id="__toasts"
  class="layout-default__teleport fixed left-0 right-0 z-10 flex"
></div> -->
    </div>
  </div>
</template>
