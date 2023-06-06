const logger = useConsola('authorization/middleware')

export default defineNuxtRouteMiddleware(async (to, from) => {
  logger.success(`Test global middleware ${from.fullPath} -> ${to.fullPath}`)

  const authorizationStore = useAuthorizationStore()
  const usersStore = useUsersStore()
  if (!authorizationStore.authorization) {
    // const { getToken } = useAuth()
    // const token = await getToken()

    // refresh method
    const userTokenData = await usersStore.postCurrent({
      email: 'root@root.ru',
      password: '12345678',
    })

    authorizationStore.setCookie(userTokenData)

    if (!userTokenData)
      return navigateTo('/login')

    authorizationStore.authorization = userTokenData.access_token || null

    const currentUser = await usersStore.getCurrent()
    if (currentUser)
      authorizationStore.current = currentUser
  }
})
