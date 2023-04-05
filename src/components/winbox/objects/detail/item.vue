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
  <SimpleBar
    class="overflow-auto"
    :auto-hide="false"
    :scrollbar-min-size="100"
  >
    <div class="objects-detail-item p-6">
      {{ item }}
    </div>
  </SimpleBar>
</template>
