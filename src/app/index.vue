<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage :key="route.fullPath" />
    </NuxtLayout>
    <NuxtLayout name="modals">
      jjjj
    </NuxtLayout>
  </div>
</template>
