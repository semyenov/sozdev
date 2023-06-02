<script lang="ts" setup>
definePageMeta({
  layout: 'un-auth',
})
const Email = ref('root@root.ru')
const Password = ref('12345678')
async function login() {
  const { login } = useAuth()
  const body = {
    email: Email.value,
    password: Password.value,
  }
  const user = await login(body)
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
