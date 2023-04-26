<script lang="ts" setup>
import type { TabsListState } from '~/types/tabs'

const instance = getCurrentInstance()
const tabsListState = inject<TabsListState>('tabsListState')

const index = computed(() => {
  if (tabsListState && instance) {
    return tabsListState.tabs.value.findIndex(
      target => target.uid === instance.uid,
    )
  }

  return -1
})
const isActive = computed(() =>
  tabsListState ? index.value === tabsListState.active.value : false,
)

watchEffect(
  () => {
    if (index.value === -1 && tabsListState && instance)
      tabsListState.tabs.value.push(instance)
  },
  {
    flush: 'post',
  },
)

function activateTab() {
  if (tabsListState)
    tabsListState.selectTab(index.value)
}
</script>

<template>
  <div class="tabs-list__item" :class="{ active: isActive }">
    <slot :is-active="isActive" :activate-tab="activateTab" />
  </div>
</template>
