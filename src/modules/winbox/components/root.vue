<script setup lang="ts">
import { winboxWindowsParamsStorage } from '../utils/winbox'
import { ClientOnly } from '#components'

const { vueApp } = useNuxtApp()

const windowsParams = computed(() =>
  [...winboxWindowsParamsStorage.value.values()].filter(
    (params) => !!params.dataComponent
  )
)
</script>

<template>
  <ClientOnly>
    <WinboxWindow v-for="p in windowsParams" :key="p.id" :params="p">
      <component
        :is="vueApp.component(p.dataComponent!)"
        v-bind="p.dataProps"
      />
    </WinboxWindow>
  </ClientOnly>
</template>
