const logger = useConsola('authorization/middleware')

export default defineNuxtRouteMiddleware(async (to, from) => {
  logger.success(`Test global middleware ${from.fullPath} -> ${to.fullPath}`)
  const authorizationStore = useAuthorizationStore()
  const usersStore = useUsersStore()
  if (!authorizationStore.authorization) {
    const userTokenData = await usersStore.refreshCurrent({
      email: 'root@root.ru',
      password: '12345678',
    })

    authorizationStore.setCookie(userTokenData)

    if (!userTokenData)
      return navigateTo('/login')
  }
  if (!authorizationStore.current) {
    const currentUser = await usersStore.getCurrent()
    if (currentUser)
      authorizationStore.current = currentUser
  }
})
