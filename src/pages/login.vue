<script lang="ts" setup>
import type { IUserLoginInput } from '~/types'

definePageMeta({
  layout: 'unauthorized',
})

const userStore = useUsersStore()
const authorizationStore = useAuthorizationStore()

const userLoginInput = reactive<IUserLoginInput>({
  email: 'root@root.ru',
  password: '12345678',
})

async function login() {
  const userTokens = await userStore.postCurrent(userLoginInput)

  if (userTokens) {
    authorizationStore.setCookie(userTokens)
    await navigateTo('/')
  }
}
</script>

<template>
  <div class="w-full flex flex-row items-center justify-center">
    <div class="m-auto w-auto flex flex-col gap-4">
      <AInput v-model="userLoginInput.email" placeholder="Email" />
      <AInput v-model="userLoginInput.password" placeholder="Password" />
      <ABtn @click="login">
        Login
      </ABtn>
    </div>
  </div>
</template>
