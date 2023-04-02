<script setup lang="ts">
import { winboxWindowsParamsStorage } from '../utils/winbox'
const { vueApp } = useNuxtApp()

const windowsParams = computed(() =>
  [...winboxWindowsParamsStorage.value.values()].filter(
    (params) => !!params.dataComponent
  )
)
</script>

<template>
  <WinboxWindow v-for="p in windowsParams" :key="p.id" :params="p">
    <component :is="vueApp.component(p.dataComponent!)" v-bind="p.dataProps" />
  </WinboxWindow>
</template>
