<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'authorization',
  validate: (r) => (r.name === 'users-id' ? validateUuid(r.params.id) : false),
})

const route = useRoute('users-id')
const id = route.params.id

const usersStore = useUsersStore()
const usersGetter = usersStore.itemGetter

const item = await usersGetter(id)
</script>

<template>
  <div class="page h-full w-full page-users-id">
    <div v-if="item" class="sticky flex flex-row box-color__default--2">
      <PageTitle v-if="item.info.first_name && item.info.last_name">
        {{ `# ${item.info.first_name} ${item.info.last_name} Page` }}
      </PageTitle>
    </div>
    <div
      v-if="item"
      class="h-full max-h-screen max-w-200 w-full flex flex-col items-center gap-8 overflow-y-scroll p-6 scrollbar scrollbar-rounded"
    >
      <UsersItem :item="item" :index="0" />
    </div>
  </div>
</template>
