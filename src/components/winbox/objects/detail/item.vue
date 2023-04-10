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
    :scrollbar-min-size="100"
    :scrollbar-max-size="300"
  >
    <div class="objects-detail-item p-6">
      {{ item }}
    </div>
  </SimpleBar>
</template>
