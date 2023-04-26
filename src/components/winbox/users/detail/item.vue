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
  <SimpleBar
    class="overflow-auto"
    :scrollbar-min-size="100"
    :scrollbar-max-size="300"
  >
    <div class="users-detail-item max-h-full p-6">
      {{ item }}
    </div>
  </SimpleBar>
</template>
