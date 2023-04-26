<script lang="ts" setup>
import Button from '../components/button.vue'

function initState() {
  return {
    color: 'default',
    rounded: 'md',
    size: 'md',
    outline: false,
    border: true,
  }
}
</script>

<template>
  <Story
    title="Button"
    :layout="{
      type: 'grid',
      width: 200,
    }"
  >
    <Variant
      title="playground"
      :init-state="initState"
    >
      <template #default="{ state }">
        <Button
          :color="state.color"
          :rounded="state.rounded"
          :size="state.size"
          :border="state.border"
          :outline="state.outline"
        >
          Click me
        </Button>
      </template>
    </Variant>
  </Story>
</template>
