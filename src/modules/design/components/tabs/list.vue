<script lang="ts" setup>
import type { ComponentInternalInstance } from 'vue'
import type { TabsListState } from '~/types/tabs'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },

  tag: {
    type: String,
    default: 'div',
  },
})

const emit = defineEmits(['update:modelValue'])

const active = computed(() => props.modelValue)
const tabs: Ref<ComponentInternalInstance[]> = ref([])

function selectTab(tab: string | number) {
  emit('update:modelValue', tab)
}

provide<TabsListState>('tabsListState', {
  tabs,
  selectTab,
  active,
})
</script>

<template>
  <Component :is="tag">
    <slot />
  </Component>
</template>
