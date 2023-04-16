<script setup lang="ts">
import Input from '../components/input.vue'

function initState() {
  return {
    color: 'default',
    rounded: 'md',
    size: 'md',
  }
}
</script>

<template>
  <Story
    :layout="{
      type: 'grid',
      width: 'auto',
    }"
  >
    <Variant
      title="Default"
      :init-state="initState"
    >
      <template #default="{ state }">
        <Input
          class="w-full"
          :color="state.color"
          :rounded="state.rounded"
          :size="state.size"
        />
      </template>
    </Variant>
  </Story>
</template>
