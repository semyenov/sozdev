const logger = useConsola('authorization/middleware')

export default defineNuxtRouteMiddleware(async (to, from) => {
  logger.success(`Test global middleware ${from.fullPath} -> ${to.fullPath}`)

  const authorizationStore = useAuthorizationStore()
  if (!authorizationStore.authorization) {
    const { getToken } = useAuth()
    const token = await getToken()

    logger.info('token middleware', token.value)

    if (!token.value || !token.value.access_token)
      return navigateTo('/login')

    authorizationStore.authorization = token.value.access_token
  }
  // if (!authorizationStore.authorization)
  //   return navigateTo('login')
  // if (!authorizationStore.current) {
  //   const usersStore = useUsersStore()
  //   const userTokenData = await usersStore.postCurrent({
  //     email: 'root@root.ru',
  //     password: '12345678',
  //   })

  //   if (userTokenData) {
  //     authorizationStore.authorization = userTokenData.access_token || null

  //     const currentUser = await usersStore.getCurrent()
  //     if (currentUser)
  //       authorizationStore.current = currentUser
  //   }
  // }
})
