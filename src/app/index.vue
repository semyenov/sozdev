<script setup lang="ts">
const route = useRoute()
console.log(route.fullPath)
</script>

<template>
  <NuxtLayout>
    <NuxtPage :key="route.fullPath" />
  </NuxtLayout>
</template>
