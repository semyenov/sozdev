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
  <div class="p-6 objects-detail-item">
    {{ item }}
  </div>
</template>
