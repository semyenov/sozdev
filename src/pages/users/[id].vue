<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'authorization',
  validate: r => (r.name === 'users-id' ? validateUuid(r.params.id) : false),
})

const route = useRoute('users-id')
const id = route.params.id

const usersStore = useUsersStore()
const usersGetter = usersStore.itemGetter

const item = await usersGetter(id)
</script>

<template>
  <div class="w-full page h-full page-users-id">
    <div v-if="item" class="flex flex-row sticky box-color__default--2">
      <PageTitle v-if="item.info.first_name && item.info.last_name">
        {{ `# ${item.info.first_name} ${item.info.last_name} Page` }}
      </PageTitle>
    </div>
    <div
      v-if="item"
      class="h-full w-full flex flex-col items-center scrollbar scrollbar-rounded max-h-screen max-w-200 gap-8 overflow-y-scroll p-6"
    >
      <UsersItem :item="item" :index="0" />
    </div>
  </div>
</template>
