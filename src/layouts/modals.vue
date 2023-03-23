<script setup lang="ts">
const refElements = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="layout fixed w-full layout-modals">
    <div ref="refElements" class="winbox">
      <Component
        :is="vnode"
        v-for="[key, vnode] of runtimeContainers.entries()"
        :key="key"
        :root-el="refElements"
      >
      </Component>
    </div>
  </div>
</template>
