<script setup lang="ts">
const rootRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="w-full layout fixed layout-modals">
    <div ref="rootRef" class="winbox">
      <template v-for="[id, info] of winboxWindows.entries()" :key="id">
        <Component :is="getWinboxVNode(info)" :root-el="rootRef"> </Component>
      </template>
    </div>
  </div>
</template>
