<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
const objectsStore = useObjectsStore()
const item = await objectsStore.itemGetter(props.id)
</script>

<template>
  <div class="objects-item p-6">
    {{ item }}
  </div>
</template>
