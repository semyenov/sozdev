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
          <ALoader
            class="[--a-loader-overlay-bg-c:var(--a-surface-c)]"
          >
            <i class="i-bx-bxs-heart animate-heart-beat animate-count-infinite text-6xl text-red-500" />
          </ALoader>
        </template>
      </Suspense>
    </WinboxWindow>
  </ClientOnly>
</template>
