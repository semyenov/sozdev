<script setup lang="ts">
const keys = useMagicKeys()
const tildaKey = keys['\\']

watch(tildaKey, v => v && toggleDark())
</script>

<template>
  <div
    class="flex flex-grow overflow-hidden"
  >
    <div class="z-100 h-2">
      <NuxtLoadingIndicator />
    </div>

    <div
      class="fixed bottom-0 left-0 top-0 z-3 w-full flex flex-row"
    >
      <div
        class="z-0 w-full flex flex-col items-center justify-center text-left"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
