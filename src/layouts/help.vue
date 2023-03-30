<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, (v) => v && toggleDark())
const authorizationStore = useAuthorizationStore()
</script>

<template>
  <div
    class="flex flex-grow layout layout-default overflow-hidden box-color__default--3"
  >
    <div class="layout-default__loading z-100 h-2">
      <NuxtLoadingIndicator />
    </div>

    <div
      id="teleport-layer--20"
      class="flex layout-default__teleport fixed left-0 right-0 z-20 w-full relative h-full"
    ></div>

    <div
      id="teleport-layer--10"
      class="layout-default__teleport fixed relative left-0 right-0 h-full w-full flex z-10"
    ></div>

    <div
      v-if="authorizationStore.current"
      class="z-10 flex flex-col layout-default__current-user"
    >
      <AuthorizationCurrent />
    </div>
    <div
      class="fixed left-0 flex layout-default__left bottom-0 top-0 flex-row z-3"
    >
      <div class="border-r box-color__default--2">
        <PageSidebar />
      </div>
      <div
        class="flex flex-col layout-default__page items-start justify-items-stretch text-left z-0"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
