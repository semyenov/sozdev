const logger = useConsola('authorization/middleware')
const loginPath = '/login'

export default defineNuxtRouteMiddleware(async (to, from) => {
  logger.success(`Test global middleware ${from.fullPath} -> ${to.fullPath}`)

  const authorizationStore = useAuthorizationStore()
  const usersStore = useUsersStore()

  if (!authorizationStore.access_token && to.path !== loginPath)
    return navigateTo(loginPath)

  if (!authorizationStore.current) {
    const currentUser = await usersStore.getCurrent()
    if (currentUser)
      authorizationStore.current = currentUser
  }
})
