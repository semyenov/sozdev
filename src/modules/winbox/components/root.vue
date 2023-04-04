<script setup lang="ts">
import { winboxWindowsParamsStorage } from '../utils/winbox'

import { ClientOnly } from '#components'

const { vueApp } = useNuxtApp()
</script>

<template>
  <ClientOnly>
    <WinboxWindow
      v-for="p in winboxWindowsParamsStorage.values()"
      :key="`${p.id}--window`"
      :params="p"
    >
      <Suspense :key="`${p.id}--suspense`">
        <!-- main content -->
        <component
          :is="vueApp.component(p.dataComponent!)"
          :key="`${p.id}--component`"
          v-bind="p.dataProps"
        />

        <!-- loading state -->
        <template #fallback>
          <div class="text-sm m-auto">
            LOADING
          </div>
        </template>
      </Suspense>
    </WinboxWindow>
  </ClientOnly>
</template>
