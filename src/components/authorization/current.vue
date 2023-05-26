<script setup lang="ts">
import { objectPick } from '@antfu/utils'

const authorizationStore = useAuthorizationStore()
const userFullName = computed(
  () =>
    authorizationStore.current
    && Object.values(
      objectPick(authorizationStore.current.info, ['first_name', 'last_name']),
    ).join(' '),
)
</script>

<template>
  <div
    class="inline-flex flex-row items-center"
    un-dark="  bg-opacity-75"
  >
    <i class="i-carbon:worship-jewish mr-2" />
    <span>{{ userFullName }}</span>
  </div>
</template>
