<script lang="ts" setup>
definePageMeta({
  layout: 'un-auth',
})
const Email = ref('root@root.ru')
const Password = ref('12345678')
const userStore = useUsersStore()
const authorizationStore = useAuthorizationStore()
async function login() {
  const tokens = await userStore.postCurrent({
    email: Email.value,
    password: Password.value,
  })

  if (tokens) {
    authorizationStore.setCookie(tokens)
    await navigateTo('/')
  }
}
</script>

<template>
  <div>
    <div>
      Login
      <AInput v-model="Email" placeholder="Email" />
      <AInput v-model="Password" placeholder="Password" />
      <ABtn @click="login">
        Login
      </ABtn>
    </div>
  </div>
</template>
