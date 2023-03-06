const logger = useLogger('authorization/middleware')

export default defineNuxtRouteMiddleware(async (to, from) => {
  logger.success(`Test global middleware ${from.fullPath} -> ${to.fullPath}`)

  const usersStore = useUsersStore()
  const authorizationStore = useAuthorizationStore()

  const userTokenData = await usersStore.postCurrent({
    email: 'dez@hotmail.com',
    password: '12345678',
  })

  if (userTokenData) {
    authorizationStore.authorization = userTokenData.access_token || null
    await usersStore.getItems()
    const currentUser = await usersStore.getCurrent()

    if (currentUser) {
      authorizationStore.current = currentUser
    }
  }
})
