<script setup lang="ts">
const attrs = useAttrs()
</script>

<template>
  <div class="prose prose-gray" v-bind="attrs" un-dark="prose-invert">
    <slot />
  </div>
</template>
