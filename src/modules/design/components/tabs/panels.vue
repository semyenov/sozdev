<script lang="ts" setup>
const props = defineProps({
  modelValue: Number,
})

provide('tabsPanelState', {
  active: computed(() => props.modelValue),
  panels: ref([]),
})
</script>

<template>
  <slot />
</template>
