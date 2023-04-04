<script lang="ts" setup>
import type { TabsPanelsState } from '~/types/tabs'

const instance = getCurrentInstance()
const tabsPanelState = inject<TabsPanelsState>('tabsPanelState')
const index = computed(() => {
  if (tabsPanelState && instance) {
    return tabsPanelState.panels.value.findIndex(
      target => target.uid === instance.uid,
    )
  }

  return -1
})

const isActive = computed(() =>
  tabsPanelState ? tabsPanelState.active.value === index.value : false,
)

watchEffect(
  () => {
    if (index.value === -1 && tabsPanelState && instance)
      tabsPanelState.panels.value.push(instance)
  },
  {
    flush: 'pre',
  },
)
</script>

<template>
  <slot v-if="isActive" />
</template>
