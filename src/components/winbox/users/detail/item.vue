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
  <div class="p-6 users-detail-item">
    {{ item }}
  </div>
</template>
