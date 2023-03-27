<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
const usersStore = useUsersStore()
const item = await usersStore.itemGetter(props.id)
</script>

<template>
  <div class="objects-item p-6">
    {{ item }}
  </div>
</template>
